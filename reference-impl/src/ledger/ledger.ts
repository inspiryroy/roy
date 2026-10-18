// Minimal multi-currency double-entry ledger. Every journal must balance per
// currency/asset; balances are integer minor units (bigint).
//
// Account naming convention used by the switch:
//   mpp:<id>:due            – what the wallet (MPP) owes the network, in payer currency
//   acqp:<id>:owed          – what the network owes the local settlement partner, in settlement asset
//   fx:<asset>:position     – network's FX position (the conversion leg between currencies)
//   revenue:fx-margin / revenue:network-fee / revenue:fixed-fee
//   settlement:<asset>:hub  – network's on-chain treasury wallet

export interface Posting {
  account: string;
  asset: string;
  /** Positive = debit, negative = credit. */
  amount: bigint;
}

export interface Journal {
  id: string;
  ref: string;
  memo: string;
  at: number;
  postings: Posting[];
}

export class Ledger {
  private readonly journals: Journal[] = [];
  private readonly balances = new Map<string, bigint>();
  private readonly byId = new Map<string, Journal>();

  post(j: Journal): void {
    const prior = this.byId.get(j.id);
    if (prior) {
      // Idempotent replay only when the content is identical; a different journal reusing
      // an id is a bug (e.g. a re-run settlement cycle) and must not be silently dropped.
      if (sameContent(prior, j)) return;
      throw new Error(`journal id ${j.id} already used with different postings`);
    }
    const sums = new Map<string, bigint>();
    for (const p of j.postings) sums.set(p.asset, (sums.get(p.asset) ?? 0n) + p.amount);
    for (const [asset, s] of sums) if (s !== 0n) throw new Error(`journal ${j.id} unbalanced in ${asset}: ${s}`);
    this.byId.set(j.id, j);
    this.journals.push(j);
    for (const p of j.postings) {
      const k = `${p.account}|${p.asset}`;
      this.balances.set(k, (this.balances.get(k) ?? 0n) + p.amount);
    }
  }

  balance(account: string, asset: string): bigint {
    return this.balances.get(`${account}|${asset}`) ?? 0n;
  }

  /** All non-zero balances, optionally filtered by account prefix. */
  snapshot(prefix = ''): Array<{ account: string; asset: string; balance: bigint }> {
    return [...this.balances]
      .filter(([k, v]) => v !== 0n && k.startsWith(prefix))
      .map(([k, balance]) => {
        const [account, asset] = k.split('|') as [string, string];
        return { account, asset, balance };
      })
      .sort((a, b) => a.account.localeCompare(b.account) || a.asset.localeCompare(b.asset));
  }

  entries(ref?: string): readonly Journal[] {
    return ref ? this.journals.filter(j => j.ref === ref) : this.journals;
  }
}

function sameContent(a: Journal, b: Journal): boolean {
  const key = (j: Journal) => j.postings.map(p => `${p.account}|${p.asset}|${p.amount}`).sort().join(';');
  return a.ref === b.ref && key(a) === key(b);
}
