// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

/// @title SettlementVault — stablecoin settlement & guarantee vault for local settlement partners (LSPs)
/// @notice Design sketch accompanying docs/04-stablecoin-settlement.md. NOT AUDITED, NOT FOR PRODUCTION.
///
/// Problem it solves: an LSP pays merchants in local currency in real time and is only
/// reimbursed in stablecoin at the end of a settlement cycle, so it carries credit risk
/// on the network operator. This vault makes that exposure enforceable on-chain:
///
///  * The operator posts a per-LSP *guarantee* in the settlement stablecoin.
///  * For every cycle the operator signs an EIP-712 statement "cumulative amount owed to LSP
///    = C as of `asOf`". The LSP keeps the latest statement as an IOU.
///  * `settle()` pays LSPs their net amounts in one atomic batch and records a hash of the
///    off-chain payment manifest (transaction-level detail stays off-chain).
///  * If the operator fails to pay within `claimDelay` after `asOf`, the LSP calls `claim()`
///    with the signed statement and is paid `C - alreadyPaid` out of its guarantee.
///  * Guarantee withdrawals are time-locked by `claimDelay`, so the operator cannot drain a
///    guarantee ahead of a claim.
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract SettlementVault {
    struct Partner {
        bool active;
        uint256 guarantee; // stablecoin held for this partner
        uint256 paid; // cumulative amount paid to the partner (settle + claim)
        uint256 pendingRelease; // guarantee withdrawal requested by operator
        uint64 releaseAt; // when pendingRelease can be executed
    }

    bytes32 private constant DOMAIN_TYPEHASH =
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    bytes32 private constant STATEMENT_TYPEHASH =
        keccak256("Statement(address partner,uint256 cumulativeOwed,uint64 asOf)");

    IERC20 public immutable asset;
    bytes32 public immutable domainSeparator;
    address public operator;
    address public statementSigner;
    uint64 public immutable claimDelay;

    mapping(address => Partner) public partners;
    mapping(bytes32 => bool) public batchSettled;

    event PartnerAdded(address indexed partner);
    event GuaranteeFunded(address indexed partner, uint256 amount);
    event ReleaseRequested(address indexed partner, uint256 amount, uint64 releaseAt);
    event GuaranteeReleased(address indexed partner, uint256 amount);
    event BatchSettled(bytes32 indexed batchId, bytes32 manifestHash, uint256 total, uint256 count);
    event Claimed(address indexed partner, uint256 amount, uint256 cumulativeOwed, uint64 asOf);

    error NotOperator();
    error UnknownPartner();
    error AlreadySettled();
    error LengthMismatch();
    error TooEarly();
    error BadSignature();
    error NothingToClaim();
    error TransferFailed();

    modifier onlyOperator() {
        if (msg.sender != operator) revert NotOperator();
        _;
    }

    constructor(IERC20 asset_, address operator_, address statementSigner_, uint64 claimDelay_) {
        asset = asset_;
        operator = operator_;
        statementSigner = statementSigner_;
        claimDelay = claimDelay_;
        domainSeparator = keccak256(
            abi.encode(DOMAIN_TYPEHASH, keccak256("SettlementVault"), keccak256("1"), block.chainid, address(this))
        );
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

    /// @notice Starts the time-lock for withdrawing part of a guarantee.
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

    // --- settlement ---------------------------------------------------------------------

    /// @notice Pays net amounts for one settlement cycle atomically from the operator's wallet.
    /// @param manifestHash hash of the off-chain manifest (payment ids, amounts, rail refs).
    function settle(bytes32 batchId, bytes32 manifestHash, address[] calldata to, uint256[] calldata amounts)
        external
        onlyOperator
    {
        if (batchSettled[batchId]) revert AlreadySettled();
        if (to.length != amounts.length) revert LengthMismatch();
        batchSettled[batchId] = true;
        uint256 total;
        for (uint256 i = 0; i < to.length; i++) {
            Partner storage p = partners[to[i]];
            if (!p.active) revert UnknownPartner();
            p.paid += amounts[i];
            total += amounts[i];
            if (!asset.transferFrom(msg.sender, to[i], amounts[i])) revert TransferFailed();
        }
        emit BatchSettled(batchId, manifestHash, total, to.length);
    }

    /// @notice Fallback for an LSP when the operator has not settled a signed statement in time.
    function claim(uint256 cumulativeOwed, uint64 asOf, uint8 v, bytes32 r, bytes32 s) external {
        Partner storage p = partners[msg.sender];
        if (!p.active) revert UnknownPartner();
        if (block.timestamp < uint256(asOf) + claimDelay) revert TooEarly();
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01", domainSeparator, keccak256(abi.encode(STATEMENT_TYPEHASH, msg.sender, cumulativeOwed, asOf))
            )
        );
        address signer = ecrecover(digest, v, r, s);
        if (signer == address(0) || signer != statementSigner) revert BadSignature();
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

    function _pull(address from, uint256 amount) private {
        if (!asset.transferFrom(from, address(this), amount)) revert TransferFailed();
    }

    function _push(address to, uint256 amount) private {
        if (!asset.transfer(to, amount)) revert TransferFailed();
    }
}
