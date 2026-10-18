// Settlement cycle: net every participant's position per asset, pay creditors
// on-chain from the network's treasury ("hub") wallet, and raise collection
// instructions for debtors (MPPs pay in their own currency – bank transfer or a
// local-currency stablecoin such as JPYC – then treasury converts to the
// settlement stablecoin).
//
// Hub-and-spoke netting: each participant ends a cycle with at most one transfer
// per asset, whatever the number of payments.

import type { ChainAdapter, SettlementPartner } from '../adapters/types.ts';
import type { Ledger } from '../ledger/ledger.ts';

export interface Instruction {
  instructionId: string;
  cycleId: string;
  participant: string;
  role: 'mpp' | 'acqp';
  asset: string;
  /** Integer units of `asset` (USDC: 6 dp; JPY: yen). */
  amount: bigint;
  direction: 'PAY' | 'COLLECT';
  status: 'PENDING' | 'SENT' | 'CONFIRMED' | 'FAILED';
  txHash?: string;
  error?: string;
}

export interface CycleReport {
  cycleId: string;
  closedAt: number;
  instructions: Instruction[];
  /** Number of captured journals settled by this cycle. */
  grossItems: number;
  /** Treasury USDC needed vs available before paying out. */
  liquidity: { asset: string; required: bigint; available: bigint; shortfall: bigint };
  /** Payer-currency amount the treasury must convert to rebuild the stablecoin float. */
  rebalance: Array<{ sell: string; sellAmount: bigint; buy: string; buyAmount: bigint }>;
}

export interface SettlementDeps {
  ledger: Ledger;
  chain: ChainAdapter;
  partners: SettlementPartner[];
  hubAddress: string;
  settlementAsset: string;
  clock?: () => number;
}

export class SettlementEngine {
  private readonly d: SettlementDeps;
  private readonly now: () => number;
  private readonly cycles: CycleReport[] = [];
  private settledJournals = 0;

  constructor(d: SettlementDeps) {
    this.d = d;
    this.now = d.clock ?? (() => Date.now());
  }

  async closeCycle(cycleId: string): Promise<CycleReport> {
    const { ledger, settlementAsset: asset } = this.d;
    const instructions: Instruction[] = [];
    let i = 0;
    const mk = (participant: string, role: 'mpp' | 'acqp', a: string, amount: bigint, direction: 'PAY' | 'COLLECT'): Instruction => ({
      instructionId: `${cycleId}-${String(++i).padStart(3, '0')}`,
      cycleId,
      participant,
      role,
      asset: a,
      amount,
      direction,
      status: 'PENDING',
    });

    for (const row of ledger.snapshot('acqp:')) {
      const id = row.account.split(':')[1]!;
      // credit balance (negative) → network owes the partner
      if (row.balance < 0n) instructions.push(mk(id, 'acqp', row.asset, -row.balance, 'PAY'));
      else instructions.push(mk(id, 'acqp', row.asset, row.balance, 'COLLECT'));
    }
    for (const row of ledger.snapshot('mpp:')) {
      const id = row.account.split(':')[1]!;
      if (row.balance > 0n) instructions.push(mk(id, 'mpp', row.asset, row.balance, 'COLLECT'));
      else instructions.push(mk(id, 'mpp', row.asset, -row.balance, 'PAY'));
    }

    const required = instructions.filter(x => x.direction === 'PAY' && x.asset === asset).reduce((s, x) => s + x.amount, 0n);
    const available = await this.d.chain.balanceOf(asset, this.d.hubAddress);
    const shortfall = required > available ? required - available : 0n;

    // Pay creditors only when the whole batch is covered: partial payment would
    // favour some partners over others and complicate their reconciliation.
    if (shortfall === 0n) {
      for (const ins of instructions) {
        if (ins.direction !== 'PAY' || ins.role !== 'acqp' || ins.asset !== asset) continue;
        const partner = this.d.partners.find(p => p.id === ins.participant);
        if (!partner) {
          ins.status = 'FAILED';
          ins.error = 'unknown partner';
          continue;
        }
        try {
          const tx = await this.d.chain.transfer({ asset, from: this.d.hubAddress, to: partner.settlementAddress, amount: ins.amount, memo: ins.instructionId });
          ins.txHash = tx.txHash;
          ins.status = tx.finalized ? 'CONFIRMED' : 'SENT';
          ledger.post({
            id: `${ins.instructionId}:pay`,
            ref: cycleId,
            memo: `settle ${ins.participant}`,
            at: this.now(),
            postings: [
              { account: `acqp:${ins.participant}:owed`, asset, amount: ins.amount },
              { account: `settlement:${asset}:hub`, asset, amount: -ins.amount },
            ],
          });
        } catch (e) {
          ins.status = 'FAILED';
          ins.error = (e as Error).message;
        }
      }
    }

    // FX position: payer-currency claims vs stablecoin paid out → treasury rebalance.
    const rebalance: CycleReport['rebalance'] = [];
    const pos = ledger.snapshot(`fx:${asset}:position`);
    const usd = pos.find(r => r.asset === asset)?.balance ?? 0n;
    for (const r of pos.filter(r => r.asset !== asset && r.balance < 0n)) {
      rebalance.push({ sell: r.asset, sellAmount: -r.balance, buy: asset, buyAmount: usd });
    }

    const captured = ledger.entries().filter(j => j.id.endsWith(':capture')).length;
    const report: CycleReport = {
      cycleId,
      closedAt: this.now(),
      instructions,
      grossItems: captured - this.settledJournals,
      liquidity: { asset, required, available, shortfall },
      rebalance,
    };
    this.settledJournals = captured;
    this.cycles.push(report);
    return report;
  }

  /** Records an MPP's payment of its due amount (bank wire or on-chain JPYC). */
  confirmCollection(cycleId: string, instructionId: string, externalRef: string): void {
    const c = this.cycles.find(x => x.cycleId === cycleId);
    const ins = c?.instructions.find(x => x.instructionId === instructionId);
    if (!ins || ins.direction !== 'COLLECT' || ins.status === 'CONFIRMED') throw new Error('no pending collection');
    this.d.ledger.post({
      id: `${instructionId}:collect`,
      ref: cycleId,
      memo: `collect ${ins.participant} ${externalRef}`,
      at: this.now(),
      postings: [
        { account: `${ins.role}:${ins.participant}:${ins.role === 'mpp' ? 'due' : 'owed'}`, asset: ins.asset, amount: -ins.amount },
        { account: `treasury:${ins.asset}:cash`, asset: ins.asset, amount: ins.amount },
      ],
    });
    ins.status = 'CONFIRMED';
    ins.txHash = externalRef;
  }
}
