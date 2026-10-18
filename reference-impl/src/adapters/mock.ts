// In-memory adapters for tests and the demo. Production adapters wrap the
// partner bank / e-money issuer API (which in turn speaks ISO 20022 or ISO 8583
// to the national switch) and a custody/MPC wallet for on-chain transfers.

import type {
  ChainAdapter,
  ChainTransfer,
  CreditInstruction,
  CreditResult,
  MppNotifier,
  OffRamp,
  Screening,
  ScreeningDecision,
  SettlementPartner,
} from './types.ts';

export type Behaviour = 'success' | 'fail' | 'timeout-then-success' | 'timeout-then-fail';

export class MockPartner implements SettlementPartner {
  readonly id: string;
  readonly routingKeys: readonly string[];
  readonly settlementAsset: string;
  readonly settlementAddress: string;
  readonly settlementMode: 'onchain' | 'fiat';
  behaviour: Behaviour = 'success';
  readonly credits: CreditInstruction[] = [];
  private readonly pending = new Map<string, CreditResult>();

  constructor(id: string, routingKeys: string[], opts: { settlementMode?: 'onchain' | 'fiat'; settlementAsset?: string; settlementAddress?: string } = {}) {
    this.id = id;
    this.routingKeys = routingKeys;
    this.settlementMode = opts.settlementMode ?? 'onchain';
    this.settlementAsset = opts.settlementAsset ?? 'USDC';
    this.settlementAddress = opts.settlementAddress ?? `0x${id.toLowerCase()}`;
  }

  async credit(instr: CreditInstruction): Promise<CreditResult> {
    this.credits.push(instr);
    const railRef = `${this.id}-${this.credits.length}`;
    switch (this.behaviour) {
      case 'success':
        return { status: 'SUCCESS', railRef };
      case 'fail':
        return { status: 'FAILED', reason: 'BENEFICIARY_ACCOUNT_CLOSED' };
      case 'timeout-then-success':
        this.pending.set(instr.paymentId, { status: 'SUCCESS', railRef });
        return { status: 'UNKNOWN' };
      case 'timeout-then-fail':
        this.pending.set(instr.paymentId, { status: 'FAILED', reason: 'REJECTED_BY_SWITCH' });
        return { status: 'UNKNOWN' };
    }
  }

  async inquire(paymentId: string): Promise<CreditResult> {
    return this.pending.get(paymentId) ?? { status: 'UNKNOWN' };
  }

  async refund(paymentId: string): Promise<CreditResult> {
    return { status: 'SUCCESS', railRef: `${this.id}-RF-${paymentId}` };
  }
}

export class MockOffRamp implements OffRamp {
  readonly address: string;
  readonly payouts: Array<{ partnerId: string; asset: string; amount: bigint; fiatCurrency: string; reference: string; wireRef: string }> = [];
  constructor(address = '0xHUB-OFFRAMP') {
    this.address = address;
  }
  async payout(input: { partnerId: string; asset: string; amount: bigint; fiatCurrency: string; reference: string }): Promise<{ wireRef: string }> {
    const wireRef = `WIRE-${this.payouts.length + 1}`;
    this.payouts.push({ ...input, wireRef });
    return { wireRef };
  }
}

export class InMemoryChain implements ChainAdapter {
  private readonly bal = new Map<string, bigint>();
  readonly txs: Array<ChainTransfer & { txHash: string }> = [];

  mint(asset: string, address: string, amount: bigint): void {
    const k = `${asset}|${address}`;
    this.bal.set(k, (this.bal.get(k) ?? 0n) + amount);
  }

  async transfer(t: ChainTransfer): Promise<{ txHash: string; finalized: boolean }> {
    const from = `${t.asset}|${t.from}`;
    const have = this.bal.get(from) ?? 0n;
    if (have < t.amount) throw new Error(`insufficient ${t.asset} at ${t.from}: ${have} < ${t.amount}`);
    this.bal.set(from, have - t.amount);
    this.mint(t.asset, t.to, t.amount);
    const txHash = `0x${(this.txs.length + 1).toString(16).padStart(64, '0')}`;
    this.txs.push({ ...t, txHash });
    return { txHash, finalized: true };
  }

  async balanceOf(asset: string, address: string): Promise<bigint> {
    return this.bal.get(`${asset}|${address}`) ?? 0n;
  }
}

/** Per-payment and per-day velocity limits plus a name block-list. */
export class RuleScreening implements Screening {
  private readonly perTxnMax: Map<string, bigint>;
  private readonly blockedNames: RegExp[];
  constructor(perTxnMax: Record<string, bigint>, blockedNames: RegExp[] = []) {
    this.perTxnMax = new Map(Object.entries(perTxnMax));
    this.blockedNames = blockedNames;
  }
  async screen(input: Parameters<Screening['screen']>[0]): Promise<ScreeningDecision> {
    const max = this.perTxnMax.get(input.currency);
    if (max !== undefined && input.amountMinor > max) return { allow: false, reason: `exceeds per-transaction limit for ${input.currency}` };
    if (input.merchantName && this.blockedNames.some(r => r.test(input.merchantName!))) {
      return { allow: false, reason: 'merchant name hit on screening list', review: true };
    }
    return { allow: true };
  }
}

export class RecordingNotifier implements MppNotifier {
  readonly events: Array<{ mppId: string; paymentRequestId: string; paymentId: string; status: string; at: number }> = [];
  async notify(mppId: string, e: { paymentRequestId: string; paymentId: string; status: string; at: number }): Promise<void> {
    this.events.push({ mppId, ...e });
  }
}
