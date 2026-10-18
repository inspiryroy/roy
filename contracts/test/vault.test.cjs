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

async function statement(partner, cumulativeOwed, asOf, key = signer) {
  const net = await provider.getNetwork();
  const domain = { name: 'SettlementVault', version: '1', chainId: net.chainId, verifyingContract: await vault.getAddress() };
  const types = { Statement: [{ name: 'partner', type: 'address' }, { name: 'cumulativeOwed', type: 'uint256' }, { name: 'asOf', type: 'uint64' }] };
  return ethers.Signature.from(await key.signTypedData(domain, types, { partner, cumulativeOwed, asOf }));
}

async function now() {
  return (await provider.getBlock('latest')).timestamp;
}

before(async () => {
  art = compile();
  provider = new ethers.BrowserProvider(ganache.provider({ logging: { quiet: true }, chain: { chainId: 1337 }, wallet: { totalAccounts: 6 } }));
  [operator, lsp1, lsp2, stranger] = await Promise.all([0, 1, 2, 3].map(i => provider.getSigner(i)));
  signer = ethers.Wallet.createRandom();
  usdc = await deploy(art.usdc, operator);
  vault = await deploy(art.vault, operator, await usdc.getAddress(), operator.address, signer.address, DAY);
  await (await usdc.mint(operator.address, 10_000_000_000n)).wait();
  await (await usdc.approve(await vault.getAddress(), ethers.MaxUint256)).wait();
  await (await vault.addPartner(lsp1.address)).wait();
  await (await vault.addPartner(lsp2.address)).wait();
  await (await vault.fundGuarantee(lsp1.address, 500_000_000n)).wait(); // 500 USDC
});

test('batch settlement pays every partner atomically and only once', async () => {
  const batch = ethers.id('2026-10-18');
  await (await vault.settle(batch, ethers.id('manifest'), [lsp1.address, lsp2.address], [44_187_500n, 12_000_000n])).wait();
  assert.equal(await usdc.balanceOf(lsp1.address), 44_187_500n);
  assert.equal(await usdc.balanceOf(lsp2.address), 12_000_000n);
  assert.equal((await vault.partners(lsp1.address)).paid, 44_187_500n);
  await assert.rejects(vault.settle(batch, ethers.id('manifest'), [lsp1.address], [1n]));
});

test('only the operator can settle or move guarantees', async () => {
  await assert.rejects(vault.connect(stranger).settle(ethers.id('x'), ethers.ZeroHash, [lsp1.address], [1n]));
  await assert.rejects(vault.connect(lsp1).requestRelease(lsp1.address, 1n));
});

test('LSP claims an unpaid signed statement from its guarantee after the delay', async () => {
  const asOf = BigInt(await now());
  const owed = 44_187_500n + 80_000_000n; // cumulative: already-settled + 80 USDC unpaid
  const sig = await statement(lsp1.address, owed, asOf);
  await assert.rejects(vault.connect(lsp1).claim(owed, asOf, sig.v, sig.r, sig.s)); // too early
  await warp(DAY + 1);
  await (await vault.connect(lsp1).claim(owed, asOf, sig.v, sig.r, sig.s, GAS)).wait();
  assert.equal(await usdc.balanceOf(lsp1.address), owed);
  const p = await vault.partners(lsp1.address);
  assert.equal(p.paid, owed);
  assert.equal(p.guarantee, 500_000_000n - 80_000_000n);
  // replaying the same statement pays nothing more
  await assert.rejects(vault.connect(lsp1).claim(owed, asOf, sig.v, sig.r, sig.s));
});

test('statements are bound to the partner and the signer', async () => {
  const asOf = BigInt(await now()) - BigInt(2 * DAY);
  const sig = await statement(lsp1.address, 999_000_000n, asOf);
  await assert.rejects(vault.connect(lsp2).claim(999_000_000n, asOf, sig.v, sig.r, sig.s)); // other partner
  const forged = await statement(lsp1.address, 999_000_000n, asOf, ethers.Wallet.createRandom());
  await assert.rejects(vault.connect(lsp1).claim(999_000_000n, asOf, forged.v, forged.r, forged.s));
});

test('claims are capped by the remaining guarantee', async () => {
  const asOf = BigInt(await now()) - BigInt(2 * DAY);
  const before = (await vault.partners(lsp1.address)).guarantee;
  const sig = await statement(lsp1.address, 10_000_000_000n, asOf);
  await (await vault.connect(lsp1).claim(10_000_000_000n, asOf, sig.v, sig.r, sig.s)).wait();
  assert.equal((await vault.partners(lsp1.address)).guarantee, 0n);
  assert.ok(before > 0n);
});

test('guarantee release is time-locked', async () => {
  await (await vault.fundGuarantee(lsp2.address, 100_000_000n)).wait();
  await (await vault.requestRelease(lsp2.address, 100_000_000n)).wait();
  await assert.rejects(vault.executeRelease(lsp2.address));
  await warp(DAY + 1);
  const bal = await usdc.balanceOf(operator.address);
  await (await vault.executeRelease(lsp2.address, GAS)).wait();
  assert.equal(await usdc.balanceOf(operator.address), bal + 100_000_000n);
  assert.equal((await vault.partners(lsp2.address)).guarantee, 0n);
});
