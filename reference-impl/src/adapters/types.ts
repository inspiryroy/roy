import type { SchemeMatch } from '../schemes/types.ts';

export type RailStatus = 'SUCCESS' | 'FAILED' | 'UNKNOWN';

export interface CreditInstruction {
  paymentId: string;
  scheme: SchemeMatch;
  currency: string;
  amountMinor: bigint;
  merchantName?: string;
  merchantCity?: string;
  /** Reference the merchant sees on their statement / POS. */
  reference: string;
  /** Original QR payload – some rails require it verbatim (e.g. for dynamic codes). */
  qrPayload: string;
}

export interface CreditResult {
  status: RailStatus;
  railRef?: string;
  reason?: string;
}

/**
 * A licensed participant of a national rail (bank / e-money issuer) that pushes
 * the credit to the merchant and is reimbursed in stablecoin by the network.
 */
export interface SettlementPartner {
  id: string;
  /** Routing keys this partner can deliver to (e.g. "TH:PROMPTPAY"). */
  routingKeys: readonly string[];
  /** Settlement asset and on-chain address used to reimburse the partner. */
  settlementAsset: string;
  settlementAddress: string;
  credit(instr: CreditInstruction): Promise<CreditResult>;
  /** Resolves an UNKNOWN credit after a timeout. */
  inquire(paymentId: string): Promise<CreditResult>;
  /** Merchant-initiated refund back to the network (local → payer direction). */
  refund?(paymentId: string, amountMinor: bigint): Promise<CreditResult>;
}

export interface ChainTransfer {
  asset: string;
  from: string;
  to: string;
  /** Integer base units (USDC = 6 dp). */
  amount: bigint;
  memo: string;
}

export interface ChainAdapter {
  transfer(t: ChainTransfer): Promise<{ txHash: string; finalized: boolean }>;
  balanceOf(asset: string, address: string): Promise<bigint>;
}

export type ScreeningDecision = { allow: true } | { allow: false; reason: string; review?: boolean };

export interface Screening {
  screen(input: { payerRef: string; mppId: string; scheme: SchemeMatch; merchantName?: string; amountMinor: bigint; currency: string }): Promise<ScreeningDecision>;
}

export interface MppNotifier {
  notify(mppId: string, event: { paymentRequestId: string; paymentId: string; status: string; at: number }): Promise<void>;
}
