// In-process EVM tests for SettlementVault (solc-js + ganache + ethers).
//   cd contracts && npm install && npm test
const assert = require('node:assert/strict');
const { test, before } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const solc = require('solc');
const ganache = require('ganache');
const { ethers } = require('ethers');

function compile() {
  const read = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
  const input = {
    language: 'Solidity',
    sources: { 'SettlementVault.sol': { content: read('SettlementVault.sol') }, 'MockUSDC.sol': { content: read('test/MockUSDC.sol') } },
    settings: { optimizer: { enabled: true, runs: 200 }, outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } } },
  };
  const out = JSON.parse(solc.compile(JSON.stringify(input)));
  const errs = (out.errors || []).filter(e => e.severity === 'error');
  if (errs.length) throw new Error(errs.map(e => e.formattedMessage).join('\n'));
  return { vault: out.contracts['SettlementVault.sol'].SettlementVault, usdc: out.contracts['MockUSDC.sol'].MockUSDC };
}

const DAY = 24 * 3600;
// ganache estimates gas against wall-clock time, ignoring evm_increaseTime, so
// time-dependent calls after warp() pass an explicit gas limit.
const GAS = { gasLimit: 500_000 };
let provider, operator, lsp1, lsp2, stranger, signer, usdc, vault, art;

async function deploy(a, signerAccount, ...args) {
  const f = new ethers.ContractFactory(a.abi, a.evm.bytecode.object, signerAccount);
  const c = await f.deploy(...args);
  await c.waitForDeployment();
  return c;
}

async function warp(seconds) {
  await provider.send('evm_increaseTime', [seconds]);
  await provider.send('evm_mine', []);
}

async function domain() {
  const net = await provider.getNetwork();
  return { name: 'SettlementVault', version: '1', chainId: net.chainId, verifyingContract: await vault.getAddress() };
}

async function statement(partner, cumulativeOwed, asOf, key = signer) {
  const types = { Statement: [{ name: 'partner', type: 'address' }, { name: 'cumulativeOwed', type: 'uint256' }, { name: 'asOf', type: 'uint64' }] };
  return ethers.Signature.from(await key.signTypedData(await domain(), types, { partner, cumulativeOwed, asOf }));
}

async function receipt(partnerSigner, cumulativeReceived) {
  const types = { Receipt: [{ name: 'partner', type: 'address' }, { name: 'cumulativeReceived', type: 'uint256' }] };
  return ethers.Signature.from(await partnerSigner.signTypedData(await domain(), types, { partner: partnerSigner.address, cumulativeReceived }));
}

async function now() {
  return BigInt((await provider.getBlock('latest')).timestamp);
}

/** Finds the hash of the mined, reverted transaction in a (nested) provider error. */
function revertedTxHash(e, depth = 0) {
  if (!e || typeof e !== 'object' || depth > 6) return undefined;
  if (typeof e.hash === 'string' && /^0x[0-9a-f]{64}$/i.test(e.hash)) return e.hash;
  for (const k of ['error', 'data', 'info', 'receipt']) {
    const h = revertedTxHash(e[k], depth + 1);
    if (h) return h;
  }
  return undefined;
}

/** Asserts that a transaction reverts with the given custom error. ganache reports mined reverts
 *  without the revert data, so the data is read back from the transaction trace. */
async function reverts(promise, name) {
  let error;
  try {
    const tx = await promise;
    await tx.wait();
  } catch (e) {
    error = e;
  }
  assert.ok(error, `expected ${name}, but the transaction succeeded`);
  const hash = revertedTxHash(error);
  assert.ok(hash, `expected ${name}, got ${error.shortMessage ?? error.message}`);
  // ganache leaves returnValue empty for reverts: read REVERT(offset, size) from the last step.
  const trace = await provider.send('debug_traceTransaction', [hash, { disableStorage: true }]);
  const last = trace.structLogs.at(-1);
  assert.equal(last?.op, 'REVERT', `expected ${name}, but the transaction failed with ${last?.op}`);
  const [size, offset] = last.stack.slice(-2).map(w => Number(BigInt('0x' + w)));
  const data = '0x' + last.memory.join('').slice(offset * 2, (offset + size) * 2);
  assert.equal(vault.interface.parseError(data)?.name, name);
}

before(async () => {
  art = compile();
  const mnemonic = 'test test test test test test test test test test test junk';
  provider = new ethers.BrowserProvider(
    ganache.provider({ logging: { quiet: true }, chain: { chainId: 1337, vmErrorsOnRPCResponse: true }, wallet: { mnemonic, totalAccounts: 6 } }),
  );
  // Local wallets (EIP-712 signing is done client-side; partners sign receipts), with
  // client-side nonce tracking. Every expected revert is sent with an explicit gas limit so
  // it is mined (consuming its nonce) and evaluated at chain time, not wall-clock time.
  [operator, lsp1, lsp2, stranger] = [0, 1, 2, 3].map(i => {
    const w = ethers.HDNodeWallet.fromPhrase(mnemonic, undefined, `m/44'/60'/0'/0/${i}`).connect(provider);
    const nm = new ethers.NonceManager(w);
    Object.defineProperty(nm, 'address', { value: w.address });
    return nm;
  });
  signer = ethers.Wallet.createRandom();
  usdc = await deploy(art.usdc, operator);
  vault = await deploy(art.vault, operator, await usdc.getAddress(), operator.address, signer.address, DAY);
  await (await usdc.mint(operator.address, 10_000_000_000n)).wait();
  await (await usdc.approve(await vault.getAddress(), ethers.MaxUint256)).wait();
  await (await vault.addPartner(lsp1.address)).wait();
  await (await vault.addPartner(lsp2.address)).wait();
  await (await vault.fundGuarantee(lsp1.address, 500_000_000n)).wait(); // 500 USDC
  await (await vault.fundGuarantee(lsp2.address, 500_000_000n)).wait();
});

test('claim delay is bounded', async () => {
  const f = new ethers.ContractFactory(art.vault.abi, art.vault.evm.bytecode.object, operator);
  await assert.rejects(f.deploy(await usdc.getAddress(), operator.address, signer.address, 0, GAS).then(c => c.waitForDeployment()));
});

test('batch settlement pays up to cumulative targets, once per batch', async () => {
  const batch = ethers.id('2026-10-18');
  await (await vault.settle(batch, ethers.id('manifest'), [lsp1.address, lsp2.address], [44_187_500n, 12_000_000n])).wait();
  assert.equal(await usdc.balanceOf(lsp1.address), 44_187_500n);
  assert.equal(await usdc.balanceOf(lsp2.address), 12_000_000n);
  assert.equal((await vault.partners(lsp1.address)).paid, 44_187_500n);
  await reverts(vault.settle(batch, ethers.id('manifest'), [lsp1.address], [1n], GAS), 'AlreadySettled');
  // a second batch repeating the same cumulative target moves nothing
  await (await vault.settle(ethers.id('again'), ethers.ZeroHash, [lsp1.address], [44_187_500n])).wait();
  assert.equal(await usdc.balanceOf(lsp1.address), 44_187_500n);
});

test('only the operator can settle or move guarantees', async () => {
  await reverts(vault.connect(stranger).settle(ethers.id('x'), ethers.ZeroHash, [lsp1.address], [1n], GAS), 'NotOperator');
  await reverts(vault.connect(lsp1).requestRelease(lsp1.address, 1n, GAS), 'NotOperator');
});

test('LSP claims an unpaid signed statement after the delay; a late settle of the same cycle pays nothing more', async () => {
  const asOf = await now();
  const owed = 44_187_500n + 80_000_000n; // cumulative: already settled + 80 USDC unpaid
  const sig = await statement(lsp1.address, owed, asOf);
  await reverts(vault.connect(lsp1).claim(owed, asOf, sig.v, sig.r, sig.s, GAS), 'TooEarly');
  await warp(DAY + 1);
  await (await vault.connect(lsp1).claim(owed, asOf, sig.v, sig.r, sig.s, GAS)).wait();
  assert.equal(await usdc.balanceOf(lsp1.address), owed);
  assert.equal((await vault.partners(lsp1.address)).guarantee, 500_000_000n - 80_000_000n);
  // the operator's recovered job now settles the same cycle: nothing is paid twice
  await (await vault.settle(ethers.id('late'), ethers.ZeroHash, [lsp1.address], [owed], GAS)).wait();
  assert.equal(await usdc.balanceOf(lsp1.address), owed);
  await reverts(vault.connect(lsp1).claim(owed, asOf, sig.v, sig.r, sig.s, GAS), 'NothingToClaim');
});

test('statements are bound to the partner and the signer', async () => {
  const asOf = (await now()) - BigInt(2 * DAY);
  const sig = await statement(lsp1.address, 999_000_000n, asOf);
  // lsp2 has a funded guarantee, so only the binding can make this fail
  await reverts(vault.connect(lsp2).claim(999_000_000n, asOf, sig.v, sig.r, sig.s, GAS), 'BadSignature');
  const forged = await statement(lsp1.address, 999_000_000n, asOf, ethers.Wallet.createRandom());
  await reverts(vault.connect(lsp1).claim(999_000_000n, asOf, forged.v, forged.r, forged.s, GAS), 'BadSignature');
});

test('partner-signed receipts record off-vault (wired) payments and block double claims', async () => {
  const asOf = (await now()) - BigInt(2 * DAY);
  const paidBefore = (await vault.partners(lsp2.address)).paid; // 12 USDC from the first batch
  const owed = paidBefore + 150_000_000n;
  // the 150 USDC were wired off-chain; the partner acknowledges cumulative receipt
  const rc = await receipt(lsp2, owed);
  const wrongSigner = await receipt(lsp1, owed); // signed by another partner
  await reverts(vault.recordReceipt(lsp2.address, owed, wrongSigner.v, wrongSigner.r, wrongSigner.s, GAS), 'BadSignature');
  await (await vault.connect(stranger).recordReceipt(lsp2.address, owed, rc.v, rc.r, rc.s, GAS)).wait();
  assert.equal((await vault.partners(lsp2.address)).paid, owed);
  const sig = await statement(lsp2.address, owed, asOf);
  await reverts(vault.connect(lsp2).claim(owed, asOf, sig.v, sig.r, sig.s, GAS), 'NothingToClaim');
});

test('a pending guarantee release opens claims immediately, so the LSP can claim first', async () => {
  await (await vault.requestRelease(lsp2.address, 500_000_000n)).wait();
  const asOf = await now(); // statement signed after the release request
  const owed = (await vault.partners(lsp2.address)).paid + 30_000_000n;
  const sig = await statement(lsp2.address, owed, asOf);
  await (await vault.connect(lsp2).claim(owed, asOf, sig.v, sig.r, sig.s, GAS)).wait();
  assert.equal((await vault.partners(lsp2.address)).guarantee, 470_000_000n);
  await reverts(vault.executeRelease(lsp2.address, GAS), 'TooEarly');
  await warp(DAY + 1);
  const bal = await usdc.balanceOf(operator.address);
  await (await vault.executeRelease(lsp2.address, GAS)).wait();
  assert.equal(await usdc.balanceOf(operator.address), bal + 470_000_000n);
  assert.equal((await vault.partners(lsp2.address)).guarantee, 0n);
});

test('claims are capped by the remaining guarantee', async () => {
  const asOf = (await now()) - BigInt(2 * DAY);
  const sig = await statement(lsp1.address, 10_000_000_000n, asOf);
  await (await vault.connect(lsp1).claim(10_000_000_000n, asOf, sig.v, sig.r, sig.s, GAS)).wait();
  assert.equal((await vault.partners(lsp1.address)).guarantee, 0n);
});

test('signer rotation is time-locked; the old signer stays valid only for earlier statements', async () => {
  const next = ethers.Wallet.createRandom();
  await (await vault.fundGuarantee(lsp1.address, 100_000_000n)).wait();
  await (await vault.proposeSigner(next.address)).wait();
  await reverts(vault.activateSigner(GAS), 'TooEarly');
  await warp(DAY + 1);
  await (await vault.activateSigner(GAS)).wait();
  const rotated = (await vault.rotatedAt());
  const paid = (await vault.partners(lsp1.address)).paid;
  const late = await statement(lsp1.address, paid + 1_000_000n, rotated + 10n); // old key, after rotation
  await warp(DAY + 20);
  await reverts(vault.connect(lsp1).claim(paid + 1_000_000n, rotated + 10n, late.v, late.r, late.s, GAS), 'BadSignature');
  const early = await statement(lsp1.address, paid + 1_000_000n, rotated - 10n); // old key, before rotation
  await (await vault.connect(lsp1).claim(paid + 1_000_000n, rotated - 10n, early.v, early.r, early.s, GAS)).wait();
  const fresh = await statement(lsp1.address, paid + 2_000_000n, rotated + 10n, next);
  await (await vault.connect(lsp1).claim(paid + 2_000_000n, rotated + 10n, fresh.v, fresh.r, fresh.s, GAS)).wait();
  assert.equal((await vault.partners(lsp1.address)).paid, paid + 2_000_000n);
});
