// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

/// @title SettlementVault — stablecoin settlement & guarantee vault for local settlement partners (LSPs)
/// @notice Design sketch accompanying docs/04-stablecoin-settlement.md §4.4. NOT AUDITED, NOT FOR PRODUCTION.
///
/// Problem it solves: an LSP pays merchants in local currency in real time and is only
/// reimbursed at the end of a settlement cycle, so it carries credit risk on the network
/// operator. This vault makes that exposure enforceable on-chain:
///
///  * The operator posts a per-LSP *guarantee* in the settlement stablecoin.
///  * For every cycle the operator signs an EIP-712 statement "cumulative amount owed to LSP
///    = C as of `asOf`". The LSP keeps the latest statement as an IOU.
///  * `settle()` pays LSPs up to *cumulative* targets in one atomic batch, so a settle that
///    lands after a claim for the same cycle pays nothing twice.
///  * Payments made outside the vault (fiat wires to LSPs in countries where stablecoins may
///    not enter) are recorded with an LSP-signed EIP-712 *receipt* ("cumulative received = R"),
///    so they count against later claims.
///  * If the operator fails to pay within `claimDelay` after `asOf`, the LSP calls `claim()`
///    with the signed statement and is paid `C - paid` out of its guarantee.
///  * A guarantee withdrawal is time-locked by `claimDelay`, and while it is pending every
///    statement is claimable immediately, so the LSP always gets the full window to claim first.
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract SettlementVault {
    struct Partner {
        bool active;
        uint256 guarantee; // stablecoin held for this partner
        uint256 paid; // cumulative amount paid or acknowledged as received
        uint256 pendingRelease; // guarantee withdrawal requested by operator
        uint64 releaseAt; // when pendingRelease can be executed (0 = none pending)
    }

    bytes32 private constant DOMAIN_TYPEHASH =
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    bytes32 private constant STATEMENT_TYPEHASH =
        keccak256("Statement(address partner,uint256 cumulativeOwed,uint64 asOf)");
    bytes32 private constant RECEIPT_TYPEHASH = keccak256("Receipt(address partner,uint256 cumulativeReceived)");
    uint64 public constant MIN_CLAIM_DELAY = 1 hours;
    uint64 public constant MAX_CLAIM_DELAY = 30 days;

    IERC20 public immutable asset;
    uint64 public immutable claimDelay;
    uint256 private immutable cachedChainId;
    bytes32 private immutable cachedDomainSeparator;

    address public operator;
    address public statementSigner;
    /// @notice Previous signer stays valid for statements dated before the rotation took effect.
    address public previousSigner;
    uint64 public rotatedAt;
    address public pendingSigner;
    uint64 public signerEffectiveAt;

    mapping(address => Partner) public partners;
    mapping(bytes32 => bool) public batchSettled;

    event PartnerAdded(address indexed partner);
    event GuaranteeFunded(address indexed partner, uint256 amount);
    event ReleaseRequested(address indexed partner, uint256 amount, uint64 releaseAt);
    event GuaranteeReleased(address indexed partner, uint256 amount);
    event BatchSettled(bytes32 indexed batchId, bytes32 manifestHash, uint256 total, uint256 count);
    event ReceiptRecorded(address indexed partner, uint256 cumulativeReceived);
    event Claimed(address indexed partner, uint256 amount, uint256 cumulativeOwed, uint64 asOf);
    event SignerProposed(address indexed signer, uint64 effectiveAt);
    event SignerRotated(address indexed previous, address indexed current);

    error NotOperator();
    error UnknownPartner();
    error AlreadySettled();
    error LengthMismatch();
    error TooEarly();
    error BadSignature();
    error NothingToClaim();
    error TransferFailed();
    error BadDelay();

    modifier onlyOperator() {
        if (msg.sender != operator) revert NotOperator();
        _;
    }

    constructor(IERC20 asset_, address operator_, address statementSigner_, uint64 claimDelay_) {
        if (claimDelay_ < MIN_CLAIM_DELAY || claimDelay_ > MAX_CLAIM_DELAY) revert BadDelay();
        asset = asset_;
        operator = operator_;
        statementSigner = statementSigner_;
        claimDelay = claimDelay_;
        cachedChainId = block.chainid;
        cachedDomainSeparator = _buildDomainSeparator();
    }

    /// @notice EIP-712 domain separator; recomputed if the chain id changes (fork protection).
    function domainSeparator() public view returns (bytes32) {
        return block.chainid == cachedChainId ? cachedDomainSeparator : _buildDomainSeparator();
    }

    // --- partner & guarantee management ------------------------------------------------

    function addPartner(address partner) external onlyOperator {
        partners[partner].active = true;
        emit PartnerAdded(partner);
    }

    function fundGuarantee(address partner, uint256 amount) external onlyOperator {
        Partner storage p = partners[partner];
        if (!p.active) revert UnknownPartner();
        p.guarantee += amount;
        _pull(msg.sender, amount);
        emit GuaranteeFunded(partner, amount);
    }

    /// @notice Starts the time-lock for withdrawing part of a guarantee. From now until the
    ///         release executes, the partner may claim any statement without waiting.
    function requestRelease(address partner, uint256 amount) external onlyOperator {
        Partner storage p = partners[partner];
        if (!p.active) revert UnknownPartner();
        p.pendingRelease = amount;
        p.releaseAt = uint64(block.timestamp) + claimDelay;
        emit ReleaseRequested(partner, amount, p.releaseAt);
    }

    function executeRelease(address partner) external onlyOperator {
        Partner storage p = partners[partner];
        if (p.releaseAt == 0 || block.timestamp < p.releaseAt) revert TooEarly();
        uint256 amount = p.pendingRelease > p.guarantee ? p.guarantee : p.pendingRelease;
        p.guarantee -= amount;
        p.pendingRelease = 0;
        p.releaseAt = 0;
        _push(operator, amount);
        emit GuaranteeReleased(partner, amount);
    }

    // --- signer rotation (time-locked) --------------------------------------------------

    function proposeSigner(address signer) external onlyOperator {
        pendingSigner = signer;
        signerEffectiveAt = uint64(block.timestamp) + claimDelay;
        emit SignerProposed(signer, signerEffectiveAt);
    }

    function activateSigner() external onlyOperator {
        if (pendingSigner == address(0) || block.timestamp < signerEffectiveAt) revert TooEarly();
        previousSigner = statementSigner;
        rotatedAt = uint64(block.timestamp);
        statementSigner = pendingSigner;
        pendingSigner = address(0);
        emit SignerRotated(previousSigner, statementSigner);
    }

    // --- settlement ---------------------------------------------------------------------

    /// @notice Pays partners up to cumulative targets for one settlement cycle, atomically,
    ///         from the operator's wallet. Idempotent with claim(): only `target - paid` moves.
    /// @param manifestHash hash of the off-chain manifest (payment ids, amounts, rail refs).
    function settle(bytes32 batchId, bytes32 manifestHash, address[] calldata to, uint256[] calldata cumulativeTargets)
        external
        onlyOperator
    {
        if (batchSettled[batchId]) revert AlreadySettled();
        if (to.length != cumulativeTargets.length) revert LengthMismatch();
        batchSettled[batchId] = true;
        uint256 total;
        for (uint256 i = 0; i < to.length; i++) {
            Partner storage p = partners[to[i]];
            if (!p.active) revert UnknownPartner();
            uint256 due = cumulativeTargets[i] > p.paid ? cumulativeTargets[i] - p.paid : 0;
            if (due == 0) continue;
            p.paid += due;
            total += due;
            if (!asset.transferFrom(msg.sender, to[i], due)) revert TransferFailed();
        }
        emit BatchSettled(batchId, manifestHash, total, to.length);
    }

    /// @notice Records an off-vault payment (e.g. a fiat wire) acknowledged by the partner's
    ///         EIP-712 signature. Anyone may submit it; it only ever increases `paid`.
    function recordReceipt(address partner, uint256 cumulativeReceived, uint8 v, bytes32 r, bytes32 s) external {
        Partner storage p = partners[partner];
        if (!p.active) revert UnknownPartner();
        bytes32 digest = _digest(keccak256(abi.encode(RECEIPT_TYPEHASH, partner, cumulativeReceived)));
        address signer = ecrecover(digest, v, r, s);
        if (signer == address(0) || signer != partner) revert BadSignature();
        if (cumulativeReceived > p.paid) {
            p.paid = cumulativeReceived;
            emit ReceiptRecorded(partner, cumulativeReceived);
        }
    }

    /// @notice Fallback for an LSP when the operator has not settled a signed statement in time
    ///         (or immediately while a guarantee release is pending).
    function claim(uint256 cumulativeOwed, uint64 asOf, uint8 v, bytes32 r, bytes32 s) external {
        Partner storage p = partners[msg.sender];
        if (!p.active) revert UnknownPartner();
        if (p.releaseAt == 0 && block.timestamp < uint256(asOf) + claimDelay) revert TooEarly();
        bytes32 digest = _digest(keccak256(abi.encode(STATEMENT_TYPEHASH, msg.sender, cumulativeOwed, asOf)));
        address signer = ecrecover(digest, v, r, s);
        bool valid = signer != address(0)
            && (signer == statementSigner || (signer == previousSigner && asOf < rotatedAt));
        if (!valid) revert BadSignature();
        if (cumulativeOwed <= p.paid) revert NothingToClaim();
        uint256 due = cumulativeOwed - p.paid;
        uint256 amount = due > p.guarantee ? p.guarantee : due;
        if (amount == 0) revert NothingToClaim();
        p.guarantee -= amount;
        p.paid += amount;
        _push(msg.sender, amount);
        emit Claimed(msg.sender, amount, cumulativeOwed, asOf);
    }

    // --- internals ----------------------------------------------------------------------

    function _buildDomainSeparator() private view returns (bytes32) {
        return keccak256(
            abi.encode(DOMAIN_TYPEHASH, keccak256("SettlementVault"), keccak256("1"), block.chainid, address(this))
        );
    }

    function _digest(bytes32 structHash) private view returns (bytes32) {
        return keccak256(abi.encodePacked("\x19\x01", domainSeparator(), structHash));
    }

    function _pull(address from, uint256 amount) private {
        if (!asset.transferFrom(from, address(this), amount)) revert TransferFailed();
    }

    function _push(address to, uint256 amount) private {
        if (!asset.transfer(to, amount)) revert TransferFailed();
    }
}
