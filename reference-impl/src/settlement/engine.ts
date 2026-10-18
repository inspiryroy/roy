// Settlement cycle: net every participant's open position per asset, pay creditors from
// the network's treasury ("hub"), and raise collection instructions for debtors (MPPs pay
// in their own currency – bank wire, later a JPY stablecoin – then treasury converts).
//
// Hub-and-spoke netting: each participant ends a cycle with at most one instruction per
// asset, whatever the number of payments.
//
// Ledger model (all balances in integer minor units):
//   acqp:<id>:owed / mpp:<id>:due        open position since the last cycle
//   <role>:<id>:instructed:<instrId>     amount committed to one instruction
//   settlement:<asset>:hub               on-chain treasury wallet (mirrors the chain)
//   offramp:<asset>:in-transit           stablecoin handed to the off-ramp, wire not yet confirmed
//   treasury:<ccy>:cash                  fiat bank accounts
//   fx:<asset>/<ccy>:position            open FX position per currency pair
// Closing a cycle moves every open position into an instructed account, so a later cycle
// only nets new activity and an instruction can never be issued twice.

import type { ChainAdapter, OffRamp, SettlementPartner } from '../adapters/types.ts';
import type { Ledger } from '../ledger/ledger.ts';

export type InstructionStatus = 'PENDING' | 'TRANSFERRED' | 'SENT' | 'CONFIRMED' | 'FAILED';

export interface Instruction {
  instructionId: string;
  cycleId: string;
  participant: string;
  role: 'mpp' | 'acqp';
  asset: string;
  /** Integer units of `asset` (USDC: 6 dp; JPY: yen). */
  amount: bigint;
  direction: 'PAY' | 'COLLECT';
  status: InstructionStatus;
  /** How the instruction moves money. */
  route: 'onchain' | 'offramp-wire' | 'bank-wire';
  txHash?: string;
  wireRef?: string;
  error?: string;
}

export interface CycleReport {
  cycleId: string;
  status: 'CLOSED' | 'ABORTED_SHORTFALL';
  closedAt: number;
  instructions: Instruction[];
  /** Captured payments whose positions this cycle netted. */
  grossItems: number;
  /** Treasury stablecoin needed vs available before paying out. */
  liquidity: { asset: string; required: bigint; available: bigint; shortfall: bigint };
  /** Open FX positions per pair: payer currency to sell, stablecoin to buy back. */
  rebalance: Array<{ pair: string; sell: string; sellAmount: bigint; buy: string; buyAmount: bigint }>;
}

export interface SettlementDeps {
  ledger: Ledger;
  chain: ChainAdapter;
  partners: SettlementPartner[];
  hubAddress: string;
  settlementAsset: string;
  /** Required when any partner settles in fiat. */
  offRamp?: OffRamp;
  /** Fiat currency wired to fiat-mode partners. */
  wireCurrency?: string;
  clock?: () => number;
}

export class SettlementEngine {
  private readonly d: SettlementDeps;
  private readonly now: () => number;
  private readonly cycles = new Map<string, CycleReport>();
  private settledJournals = 0;

  constructor(d: SettlementDeps) {
    this.d = d;
    this.now = d.clock ?? (() => Date.now());
  }

  async closeCycle(cycleId: string): Promise<CycleReport> {
    if (this.cycles.has(cycleId)) throw new Error(`cycle ${cycleId} already closed`);
    const { ledger, settlementAsset: asset } = this.d;
    const instructions: Instruction[] = [];
    let i = 0;
    const partnerOf = (id: string) => this.d.partners.find(p => p.id === id);

    for (const row of ledger.snapshot('acqp:')) {
      const m = /^acqp:([^:]+):owed$/.exec(row.account);
      if (!m) continue;
      const fiat = partnerOf(m[1]!)?.settlementMode === 'fiat';
      instructions.push({
        instructionId: `${cycleId}-${String(++i).padStart(3, '0')}`,
        cycleId,
        participant: m[1]!,
        role: 'acqp',
        asset: row.asset,
        // credit balance (negative) → network owes the partner
        amount: row.balance < 0n ? -row.balance : row.balance,
        direction: row.balance < 0n ? 'PAY' : 'COLLECT',
        status: 'PENDING',
        route: fiat ? 'offramp-wire' : 'onchain',
      });
    }
    for (const row of ledger.snapshot('mpp:')) {
      const m = /^mpp:([^:]+):due$/.exec(row.account);
      if (!m) continue;
      instructions.push({
        instructionId: `${cycleId}-${String(++i).padStart(3, '0')}`,
        cycleId,
        participant: m[1]!,
        role: 'mpp',
        asset: row.asset,
        amount: row.balance > 0n ? row.balance : -row.balance,
        direction: row.balance > 0n ? 'COLLECT' : 'PAY',
        status: 'PENDING',
        route: 'bank-wire',
      });
    }

    const required = instructions.filter(x => x.direction === 'PAY' && x.role === 'acqp' && x.asset === asset).reduce((s, x) => s + x.amount, 0n);
    const available = await this.d.chain.balanceOf(asset, this.d.hubAddress);
    const shortfall = required > available ? required - available : 0n;
    const captured = ledger.entries().filter(j => j.id.endsWith(':capture')).length;
    const base = { cycleId, closedAt: this.now(), instructions, liquidity: { asset, required, available, shortfall }, rebalance: this.rebalance() };

    // Pay creditors only when the whole batch is covered: partial payment would favour some
    // partners over others. An aborted cycle commits nothing and may be retried later.
    if (shortfall > 0n) return { ...base, status: 'ABORTED_SHORTFALL', grossItems: captured - this.settledJournals };

    for (const ins of instructions) {
      const open = ins.role === 'acqp' ? `acqp:${ins.participant}:owed` : `mpp:${ins.participant}:due`;
      const sign = ins.direction === (ins.role === 'acqp' ? 'PAY' : 'COLLECT') ? 1n : -1n;
      // acqp PAY: owed is a credit (−A) → +A clears it; mpp COLLECT: due is a debit (+A) → −A.
      const toOpen = ins.role === 'acqp' ? sign * ins.amount : -sign * ins.amount;
      ledger.post({
        id: `${ins.instructionId}:instruct`,
        ref: cycleId,
        memo: `${ins.direction} ${ins.participant}`,
        at: this.now(),
        postings: [
          { account: open, asset: ins.asset, amount: toOpen },
          { account: instructed(ins), asset: ins.asset, amount: -toOpen },
        ],
      });
    }

    for (const ins of instructions) {
      if (ins.role !== 'acqp' || ins.direction !== 'PAY' || ins.asset !== asset) continue;
      const partner = partnerOf(ins.participant);
      if (!partner) {
        ins.status = 'FAILED';
        ins.error = 'unknown partner';
        continue;
      }
      await this.payPartner(ins, partner);
    }

    const report: CycleReport = { ...base, status: 'CLOSED', grossItems: captured - this.settledJournals };
    this.settledJournals = captured;
    this.cycles.set(cycleId, report);
    return report;
  }

  private async payPartner(ins: Instruction, partner: SettlementPartner): Promise<void> {
    const { ledger, settlementAsset: asset } = this.d;
    try {
      if (ins.route === 'offramp-wire') {
        // Stablecoin stays at the hub side: hand it to the off-ramp, which wires fiat.
        if (!this.d.offRamp) throw new Error('fiat-mode partner but no off-ramp configured');
        const tx = await this.d.chain.transfer({ asset, from: this.d.hubAddress, to: this.d.offRamp.address, amount: ins.amount, memo: ins.instructionId });
        ins.txHash = tx.txHash;
        ins.status = 'TRANSFERRED';
        ledger.post({
          id: `${ins.instructionId}:to-offramp`,
          ref: ins.cycleId,
          memo: `to off-ramp for ${ins.participant}`,
          at: this.now(),
          postings: [
            { account: `offramp:${asset}:in-transit`, asset, amount: ins.amount },
            { account: `settlement:${asset}:hub`, asset, amount: -ins.amount },
          ],
        });
        await this.wire(ins, partner);
      } else {
        const tx = await this.d.chain.transfer({ asset, from: this.d.hubAddress, to: partner.settlementAddress, amount: ins.amount, memo: ins.instructionId });
        ins.txHash = tx.txHash;
        ins.status = tx.finalized ? 'CONFIRMED' : 'SENT';
        ledger.post({
          id: `${ins.instructionId}:pay`,
          ref: ins.cycleId,
          memo: `settle ${ins.participant}`,
          at: this.now(),
          postings: [
            { account: instructed(ins), asset, amount: ins.amount },
            { account: `settlement:${asset}:hub`, asset, amount: -ins.amount },
          ],
        });
      }
    } catch (e) {
      if (ins.status !== 'TRANSFERRED') ins.status = 'FAILED';
      ins.error = (e as Error).message;
    }
  }

  /** Off-ramp payout, idempotent on the instruction id. Safe to retry after TRANSFERRED. */
  private async wire(ins: Instruction, partner: SettlementPartner): Promise<void> {
    const asset = this.d.settlementAsset;
    const w = await this.d.offRamp!.payout({ partnerId: partner.id, asset, amount: ins.amount, fiatCurrency: this.d.wireCurrency ?? 'USD', reference: ins.instructionId });
    ins.wireRef = w.wireRef;
    ins.status = 'SENT';
    ins.error = undefined;
    this.d.ledger.post({
      id: `${ins.instructionId}:wired`,
      ref: ins.cycleId,
      memo: `wire ${w.wireRef} to ${ins.participant}`,
      at: this.now(),
      postings: [
        { account: instructed(ins), asset, amount: ins.amount },
        { account: `offramp:${asset}:in-transit`, asset, amount: -ins.amount },
      ],
    });
  }

  /** Retries the fiat wire of an instruction whose stablecoin already reached the off-ramp. */
  async retryPayout(cycleId: string, instructionId: string): Promise<Instruction> {
    const ins = this.find(cycleId, instructionId);
    if (ins.status !== 'TRANSFERRED') throw new Error('instruction is not awaiting a payout retry');
    const partner = this.d.partners.find(p => p.id === ins.participant)!;
    try {
      await this.wire(ins, partner);
    } catch (e) {
      ins.error = (e as Error).message;
    }
    return ins;
  }

  /** Partner acknowledgement of a wired payout, or MPP confirmation of a JPY payout we sent. */
  confirmPayout(cycleId: string, instructionId: string, externalRef?: string): void {
    const ins = this.find(cycleId, instructionId);
    if (ins.direction !== 'PAY') throw new Error('not a payout');
    if (ins.role === 'acqp') {
      if (ins.status !== 'SENT') throw new Error('no payout awaiting confirmation');
      ins.status = 'CONFIRMED';
      return;
    }
    // Network → MPP payout (refunds exceeded new payments): executed by bank wire.
    if (ins.status !== 'PENDING') throw new Error('MPP payout already recorded');
    this.d.ledger.post({
      id: `${instructionId}:mpp-payout`,
      ref: cycleId,
      memo: `pay ${ins.participant} ${externalRef ?? ''}`,
      at: this.now(),
      postings: [
        { account: instructed(ins), asset: ins.asset, amount: ins.amount },
        { account: `treasury:${ins.asset}:cash`, asset: ins.asset, amount: -ins.amount },
      ],
    });
    ins.status = 'CONFIRMED';
    ins.wireRef = externalRef;
  }

  /** Records money received for a COLLECT instruction (MPP bank wire, or partner repayment). */
  confirmCollection(cycleId: string, instructionId: string, externalRef: string): void {
    const ins = this.find(cycleId, instructionId);
    if (ins.direction !== 'COLLECT' || ins.status === 'CONFIRMED') throw new Error('no pending collection');
    // Partner repayments arrive as stablecoin at the hub (fiat-mode partners wire to the
    // off-ramp, which converts and delivers to the hub); MPP payments land in a bank account.
    const into = ins.role === 'acqp' ? `settlement:${ins.asset}:hub` : `treasury:${ins.asset}:cash`;
    this.d.ledger.post({
      id: `${instructionId}:collect`,
      ref: cycleId,
      memo: `collect ${ins.participant} ${externalRef}`,
      at: this.now(),
      postings: [
        { account: instructed(ins), asset: ins.asset, amount: -ins.amount },
        { account: into, asset: ins.asset, amount: ins.amount },
      ],
    });
    ins.status = 'CONFIRMED';
    ins.wireRef = externalRef;
  }

  /**
   * Books an executed treasury conversion that closes (part of) an FX position:
   * sold `sellAmount` of the payer currency from treasury cash, received `buyAmount`
   * stablecoin into the hub.
   */
  recordRebalance(id: string, payerCurrency: string, sellAmount: bigint, buyAmount: bigint): void {
    const asset = this.d.settlementAsset;
    const fx = `fx:${asset}/${payerCurrency}:position`;
    this.d.ledger.post({
      id: `rebalance:${id}`,
      ref: 'treasury',
      memo: `sell ${sellAmount} ${payerCurrency} for ${buyAmount} ${asset}`,
      at: this.now(),
      postings: [
        { account: fx, asset: payerCurrency, amount: sellAmount },
        { account: `treasury:${payerCurrency}:cash`, asset: payerCurrency, amount: -sellAmount },
        { account: `settlement:${asset}:hub`, asset, amount: buyAmount },
        { account: fx, asset, amount: -buyAmount },
      ],
    });
  }

  cycle(cycleId: string): CycleReport | undefined {
    return this.cycles.get(cycleId);
  }

  private find(cycleId: string, instructionId: string): Instruction {
    const ins = this.cycles.get(cycleId)?.instructions.find(x => x.instructionId === instructionId);
    if (!ins) throw new Error('unknown instruction');
    return ins;
  }

  /** Outstanding FX positions per currency pair (closed by recordRebalance). */
  private rebalance(): CycleReport['rebalance'] {
    const out: CycleReport['rebalance'] = [];
    for (const row of this.d.ledger.snapshot('fx:')) {
      const m = /^fx:([^/]+)\/([^:]+):position$/.exec(row.account);
      if (!m || row.asset !== m[2] || row.balance >= 0n) continue;
      const buy = this.d.ledger.balance(row.account, m[1]!);
      out.push({ pair: `${m[1]}/${m[2]}`, sell: m[2]!, sellAmount: -row.balance, buy: m[1]!, buyAmount: buy });
    }
    return out;
  }
}

function instructed(ins: Instruction): string {
  return `${ins.role}:${ins.participant}:instructed:${ins.instructionId}`;
}
