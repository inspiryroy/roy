// Identifies which national scheme(s) a scanned MPM payload belongs to and picks a route.
// A single sticker can legitimately carry several templates (e.g. a national
// template plus private-wallet templates), so identification returns every
// match and routing chooses among those we have a settlement partner for.

import { currencyByNumeric } from '../emvco/iso4217.ts';
import type { MpmPayload } from '../emvco/mpm.ts';
import type { SchemeDefinition, SchemeMatch } from './types.ts';

/** Switch-level key first, then any narrower acquirer-level keys. */
export function routeKeys(m: SchemeMatch): string[] {
  return [m.routingKey, ...(m.altRoutingKeys ?? [])];
}

export class SchemeRegistry {
  private readonly byGuid = new Map<string, SchemeDefinition>();
  private readonly defs: SchemeDefinition[] = [];

  register(def: SchemeDefinition): this {
    this.defs.push(def);
    for (const g of def.guids) {
      const key = g.toUpperCase();
      const prev = this.byGuid.get(key);
      if (prev) throw new Error(`GUID ${g} already registered by ${prev.schemeId}`);
      this.byGuid.set(key, def);
    }
    return this;
  }

  get schemes(): readonly SchemeDefinition[] {
    return this.defs;
  }

  /**
   * Every recognised template, best first: payable before declined, merchant (P2M/BILL)
   * before person-to-person, then confidence. A template whose code carries a currency
   * or country the scheme does not use is returned with `declineReason` – such codes are
   * malformed or fraudulent and must never be priced in the foreign currency.
   */
  identify(p: MpmPayload): SchemeMatch[] {
    const out: SchemeMatch[] = [];
    const cur = p.currencyNumeric ? currencyByNumeric(p.currencyNumeric)?.alpha : undefined;
    for (const acct of p.merchantAccounts) {
      const def =
        (acct.guid && this.byGuid.get(acct.guid.toUpperCase())) ||
        this.defs.find(d => d.templateTags?.includes(acct.tag) && d.matchTemplate?.(acct, p));
      if (!def) continue;
      const r = def.interpret(acct, p);
      if (!r) continue;
      const notes = [...r.notes, ...(def.validate?.(p) ?? [])];
      let declineReason = r.declineReason;
      if (!cur) declineReason ??= `currency ${p.currencyNumeric ?? '(none)'} is not supported`;
      else if (cur !== def.currency && !def.otherCurrencies?.includes(cur)) declineReason ??= `currency ${cur} is not carried by ${def.name}`;
      if (p.countryCode && p.countryCode !== def.country) declineReason ??= `country ${p.countryCode} does not match ${def.name} (${def.country})`;
      out.push({
        ...r,
        routingKey: r.routingKey ?? def.routingKey,
        notes,
        declineReason,
        amountDecimals: def.amountDecimals,
        maxAmountMinor: def.maxAmountMinor,
        schemeId: def.schemeId,
        country: def.country,
        name: def.name,
        rail: def.rail,
        currency: def.currency,
        template: acct.tag,
        guid: acct.guid ?? '',
      });
    }
    const rank = (m: SchemeMatch) => (m.declineReason ? 2 : 0) + (m.paymentType === 'P2P' ? 1 : 0);
    return out.sort((a, b) => rank(a) - rank(b) || b.confidence - a.confidence || Number(a.template) - Number(b.template));
  }

  /** Best payable merchant match whose routing key has a connected partner and that has not expired. */
  route(p: MpmPayload, connected: ReadonlySet<string>, now?: number): SchemeMatch | undefined {
    return this.identify(p).find(
      m =>
        !m.declineReason &&
        m.paymentType !== 'P2P' &&
        m.confidence >= 0.5 &&
        (now === undefined || m.qrExpiresAt === undefined || m.qrExpiresAt > now) &&
        routeKeys(m).some(k => connected.has(k)),
    );
  }
}
