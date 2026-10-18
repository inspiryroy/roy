// Identifies which national scheme(s) a scanned MPM payload belongs to and picks a route.
// A single sticker can legitimately carry several templates (e.g. a national
// template plus private-wallet templates), so identification returns every
// match and routing chooses among those we have a settlement partner for.

import { currencyByNumeric } from '../emvco/iso4217.ts';
import type { MpmPayload } from '../emvco/mpm.ts';
import type { SchemeDefinition, SchemeMatch } from './types.ts';

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

  identify(p: MpmPayload): SchemeMatch[] {
    const out: SchemeMatch[] = [];
    for (const acct of p.merchantAccounts) {
      if (!acct.guid) continue;
      const def = this.byGuid.get(acct.guid.toUpperCase());
      if (!def) continue;
      const r = def.interpret(acct, p);
      if (!r) continue;
      const notes = [...r.notes, ...(def.validate?.(p) ?? [])];
      let confidence = r.confidence;
      const cur = p.currencyNumeric ? currencyByNumeric(p.currencyNumeric)?.alpha : undefined;
      if (cur && cur !== def.currency) {
        notes.push(`currency ${cur} differs from scheme currency ${def.currency}`);
        confidence *= 0.5;
      }
      if (p.countryCode && p.countryCode !== def.country) {
        notes.push(`country ${p.countryCode} differs from scheme country ${def.country}`);
        confidence *= 0.5;
      }
      out.push({
        ...r,
        routingKey: r.routingKey ?? def.routingKey,
        notes,
        confidence,
        schemeId: def.schemeId,
        country: def.country,
        name: def.name,
        rail: def.rail,
        currency: def.currency,
        template: acct.tag,
        guid: acct.guid,
      });
    }
    return out.sort((a, b) => b.confidence - a.confidence || Number(a.template) - Number(b.template));
  }

  /** Best match whose routing key has a connected settlement partner. */
  route(p: MpmPayload, connected: ReadonlySet<string>): SchemeMatch | undefined {
    return this.identify(p).find(m => connected.has(m.routingKey) && m.confidence >= 0.5);
  }
}
