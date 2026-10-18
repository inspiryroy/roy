import assert from 'node:assert/strict';
import { test } from 'node:test';
import { crcHex } from '../src/emvco/crc16.ts';
import { fromMinorUnits, toMinorUnits } from '../src/emvco/iso4217.ts';
import { buildMpm, decodeMpm, promptedFields } from '../src/emvco/mpm.ts';
import { parseTlv, TlvError } from '../src/emvco/tlv.ts';

test('CRC-16/CCITT-FALSE check value', () => {
  assert.equal(crcHex('123456789'), '29B1');
});

test('TLV parse', () => {
  assert.deepEqual(parseTlv('000201010212'), [
    { id: '00', value: '01' },
    { id: '01', value: '12' },
  ]);
});

test('TLV rejects truncated value', () => {
  assert.throws(() => parseTlv('000201015'), TlvError);
  assert.throws(() => parseTlv('0005abc'), TlvError);
});

const base = {
  initiation: 'dynamic' as const,
  accounts: [{ tag: '26', fields: [['00', 'COM.EXAMPLE.WALLET'], ['01', '123456']] as Array<[string, string]> }],
  mcc: '5812',
  currencyNumeric: '764',
  amount: '120.50',
  countryCode: 'TH',
  merchantName: 'SOMTAM SHOP',
  merchantCity: 'BANGKOK',
  additional: [['01', 'INV-001'], ['07', 'T01']] as Array<[string, string]>,
};

test('build → decode round-trip with valid CRC', () => {
  const qr = buildMpm(base);
  const p = decodeMpm(qr);
  assert.deepEqual(p.errors, []);
  assert.equal(p.crcValid, true);
  assert.equal(p.initiation, 'dynamic');
  assert.equal(p.amount, '120.50');
  assert.equal(p.merchantAccounts[0]!.guid, 'COM.EXAMPLE.WALLET');
  assert.equal(p.additionalData?.billNumber, 'INV-001');
  assert.equal(p.additionalData?.terminalLabel, 'T01');
});

test('tampered payload fails CRC', () => {
  const qr = buildMpm(base).replace('120.50', '920.50');
  const p = decodeMpm(qr);
  assert.equal(p.crcValid, false);
  assert.match(p.errors.join(), /CRC mismatch/);
});

test('missing merchant account information is an error', () => {
  const qr = buildMpm({ ...base, accounts: [] });
  assert.match(decodeMpm(qr).errors.join(), /no Merchant Account Information/);
});

test('"***" additional data marks a payer prompt', () => {
  const qr = buildMpm({ ...base, additional: [['01', '***'], ['07', 'T01']] });
  assert.deepEqual(promptedFields(decodeMpm(qr)), ['01']);
});

test('UTF-8 language template – character and byte length modes', () => {
  const lang = { preference: 'TH', name: 'ร้านส้มตำ', city: 'กรุงเทพ' };
  for (const lengthMode of ['chars', 'bytes'] as const) {
    const p = decodeMpm(buildMpm({ ...base, language: lang, lengthMode }));
    assert.equal(p.lengthMode, lengthMode);
    assert.deepEqual(p.errors, []);
    assert.equal(p.language?.name, 'ร้านส้มตำ');
    assert.equal(p.language?.city, 'กรุงเทพ');
  }
});

test('minor-unit conversion', () => {
  assert.equal(toMinorUnits('120.5', 2), 12050n);
  assert.equal(toMinorUnits('15000', 0), 15000n);
  assert.equal(toMinorUnits('15000.00', 0), 15000n);
  assert.throws(() => toMinorUnits('1.234', 2));
  assert.equal(fromMinorUnits(12050n, 2), '120.50');
  assert.equal(fromMinorUnits(5n, 2), '0.05');
});
