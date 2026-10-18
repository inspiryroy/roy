import assert from 'node:assert/strict';
import { test } from 'node:test';
import { crcHex as crc } from '../src/emvco/crc16.ts';
import { buildMpm, decodeMpm } from '../src/emvco/mpm.ts';
import { ALL_SCHEMES } from '../src/schemes/index.ts';
import { sampleLaoQr } from '../src/schemes/la.ts';
import { sampleDuitNowQr } from '../src/schemes/my.ts';
import { SchemeRegistry } from '../src/schemes/registry.ts';
import { payNow, sampleSgqr } from '../src/schemes/sg.ts';
import { samplePromptPayQr, sampleThaiMerchantQr } from '../src/schemes/th.ts';

const registry = new SchemeRegistry();
for (const s of ALL_SCHEMES) registry.register(s);
const identify = (qr: string) => {
  const p = decodeMpm(qr);
  assert.deepEqual(p.errors, [], `decode errors: ${p.errors.join('; ')}`);
  return registry.identify(p);
};

// Examples published in PayNet's DuitNow MPM specification v1.5 (fictitious merchant).
const PAYNET_STATIC = '00020201021126410014A000000615000101065016640209123456789520499995303458540510.005802MY5909QRCSDNBHD6005BANGI6304343F';
const PAYNET_JOMPAY = '00020201021126360014A00000061500010106898989020412345204111153034585802MY5903TNB6002KL610559200621790130124007552406823231d4db4506dc9852b1c21c74be148b8363045DFB';

test('Thailand: Bill Payment merchant code routes to NITMX with Biller ID and Ref1', () => {
  const [m] = identify(sampleThaiMerchantQr({ amount: '350.00' }));
  assert.equal(m!.schemeId, 'TH.THAIQR');
  assert.equal(m!.paymentType, 'P2M');
  assert.equal(m!.routingKey, 'TH:NITMX');
  assert.equal(m!.routing.merchantId, '010555612345601');
  assert.equal(m!.routing.references.ref1, 'SHOP0001');
  assert.equal(m!.routing.references.terminal, 'POS01');
});

test('Thailand: acquirer template adds an on-us routing key', () => {
  const ms = identify(sampleThaiMerchantQr({ bankCode: '004' }));
  assert.equal(ms.length, 1, 'tag 31 is folded into the tag 30 match');
  assert.deepEqual(ms[0]!.altRoutingKeys, ['TH:ACQ:004']);
  assert.equal(ms[0]!.routing.acquirerId, '004');
  const onUs = registry.route(decodeMpm(sampleThaiMerchantQr({ bankCode: '004' })), new Set(['TH:ACQ:004']));
  assert.equal(onUs?.schemeId, 'TH.THAIQR');
  assert.equal(registry.route(decodeMpm(sampleThaiMerchantQr({ bankCode: '014' })), new Set(['TH:ACQ:004'])), undefined);
});

test('Thailand: personal PromptPay QR is classified P2P', () => {
  const [m] = identify(samplePromptPayQr());
  assert.equal(m!.paymentType, 'P2P');
  assert.equal(m!.routing.proxyType, 'MOBILE');
  assert.equal(m!.routing.account, '0066812345678');
});

test('Malaysia: PayNet specification examples (PFI "02")', () => {
  const p = decodeMpm(PAYNET_STATIC);
  assert.equal(p.crcValid, true);
  assert.match(p.warnings.join(), /Payload Format Indicator "02"/);
  const [m] = registry.identify(p);
  assert.equal(m!.schemeId, 'MY.DUITNOW');
  assert.equal(m!.routing.acquirerId, '501664');
  assert.equal(m!.paymentType, 'P2M');
  const [j] = identify(PAYNET_JOMPAY);
  assert.equal(j!.paymentType, 'BILL');
  assert.equal(j!.routing.references.rrn1, '0124007552406');
});

test('Malaysia: MCC 0000 marks a P2P DuitNow code', () => {
  const qr = PAYNET_STATIC.replace('52049999', '52040000').slice(0, -4);
  const fixed = qr + crc(qr);
  assert.equal(identify(fixed)[0]!.paymentType, 'P2P');
});

test('Singapore: SGQR label yields one match per scheme, routed by GUID not tag', () => {
  const ms = identify(sampleSgqr());
  assert.deepEqual(ms.map(m => m.schemeId).sort(), ['SG.NETS', 'SG.PAYNOW']);
  assert.equal(ms[0]!.schemeId, 'SG.NETS', 'NETS (merchant acquiring) outranks a PayNow proxy');
  const p = decodeMpm(sampleSgqr());
  assert.equal(registry.route(p, new Set(['SG:FAST']))?.schemeId, 'SG.PAYNOW');
  assert.equal(registry.route(p, new Set(['SG:NETS']))?.schemeId, 'SG.NETS');
});

test('Singapore: expired PayNow QR is not routable', () => {
  const reg = new SchemeRegistry().register(payNow(() => Date.parse('2026-10-18T00:00:00Z')));
  const qr = buildMpm({
    initiation: 'dynamic',
    accounts: [{ tag: '26', fields: [['00', 'SG.PAYNOW'], ['01', '2'], ['02', '201912345K'], ['03', '0'], ['04', '20261017']] }],
    mcc: '0000', currencyNumeric: '702', amount: '10.00', countryCode: 'SG', merchantName: 'X', merchantCity: 'Singapore',
  });
  assert.deepEqual(reg.identify(decodeMpm(qr)), []);
});

test('Laos: LAO QR merchant code', () => {
  const [m] = identify(sampleLaoQr({ amount: '150000' }));
  assert.equal(m!.schemeId, 'LA.LAOQR');
  assert.equal(m!.paymentType, 'P2M');
  assert.equal(m!.routing.acquirerId, '27710418');
  assert.deepEqual(m!.altRoutingKeys, ['LA:IIN:27710418']);
});

test('currency/country mismatch lowers confidence below the routing threshold', () => {
  const qr = sampleDuitNowQr().replace('5303458', '5303702').slice(0, -4);
  const p = decodeMpm(qr + crc(qr));
  const [m] = registry.identify(p);
  assert.ok(m!.confidence < 1);
  assert.match(m!.notes.join(), /currency SGD differs/);
});

test('registry refuses duplicate GUID registration', () => {
  assert.throws(() => new SchemeRegistry().register(ALL_SCHEMES[0]!).register(ALL_SCHEMES[0]!));
});


// ---------------------------------------------------------------------------
// Indonesia, Vietnam, Cambodia

import { sampleQris } from '../src/schemes/id.ts';
import { khqr, sampleKhqrMerchant } from '../src/schemes/kh.ts';
import { sampleVietQrMerchant } from '../src/schemes/vn.ts';
import { encodeTlv } from '../src/emvco/tlv.ts';

// Test vector shipped with the NBC KHQR JavaScript SDK (dev bank domain "devb"):
// dynamic individual KHQR, KHR 10,000, Chinese language template, ID 99 timestamps.
const KHQR_SDK_DYNAMIC =
  '00020101021229420013ishinvin@devb01090123456780208Dev Bank5204599953031165405100005802KH5909Ishin Vin6010Phnom Penh62680114INV-2022-12-250211855123456780310Ishin Shop07060123450807Payment64180002ZH0102文山0202金边99340013175507623233601131755076292336630416C4';

test('Indonesia: QRIS national domain (ID 51) with acquirer NNS from the PJSP template', () => {
  const [m] = identify(sampleQris({ amount: '85000' }));
  assert.equal(m!.schemeId, 'ID.QRIS');
  assert.equal(m!.paymentType, 'P2M');
  assert.equal(m!.routing.merchantId, 'ID2026000000001');
  assert.equal(m!.routing.acquirerId, '93609999');
  assert.deepEqual(m!.altRoutingKeys, ['ID:NNS:93609999']);
  assert.equal(m!.routing.references.acquirerGuid, 'COM.EXAMPLEBANK.WWW');
});

test('Vietnam: VietQR nested beneficiary template; P2P when no merchant identity', () => {
  const [m] = identify(sampleVietQrMerchant({ amount: '85000' }));
  assert.equal(m!.schemeId, 'VN.VIETQR');
  assert.equal(m!.paymentType, 'P2M');
  assert.equal(m!.routing.acquirerId, '970436');
  assert.equal(m!.routing.account, '1234567890');
  const p2p = buildMpm({
    initiation: 'static',
    accounts: [{ tag: '38', fields: [['00', 'A000000727'], ['01', encodeTlv([{ id: '00', value: '970436' }, { id: '01', value: '0000000000' }])], ['02', 'QRIBFTTA']] }],
    mcc: '0000', currencyNumeric: '704', countryCode: 'VN', merchantName: 'NA', merchantCity: 'HCM',
  });
  assert.equal(identify(p2p)[0]!.paymentType, 'P2P');
});

test('Cambodia: KHQR matched structurally (Bakong ID, no GUID), tag 29 = individual', () => {
  const reg = new SchemeRegistry().register(khqr(() => Date.parse('2025-08-13T09:05:00Z')));
  const p = decodeMpm(KHQR_SDK_DYNAMIC);
  assert.deepEqual(p.errors, []);
  assert.equal(p.language?.city, '金边');
  const [m] = reg.identify(p);
  assert.equal(m!.schemeId, 'KH.KHQR');
  assert.equal(m!.paymentType, 'P2P');
  assert.equal(m!.routing.account, 'ishinvin@devb');
  assert.deepEqual(m!.altRoutingKeys, ['KH:BANK:devb']);
});

test('Cambodia: expired dynamic KHQR is not routable', () => {
  const reg = new SchemeRegistry().register(khqr(() => Date.parse('2025-08-13T10:00:00Z')));
  assert.deepEqual(reg.identify(decodeMpm(KHQR_SDK_DYNAMIC)), []);
});

test('Cambodia: merchant KHQR in USD keeps confidence but flags the KHR-only channel', () => {
  const reg = new SchemeRegistry().register(khqr(() => Date.parse('2026-10-18T09:01:00Z')));
  const [m] = reg.identify(decodeMpm(sampleKhqrMerchant({ amount: '4.50', currency: 'USD' })));
  assert.equal(m!.paymentType, 'P2M');
  assert.equal(m!.confidence, 0.9);
  assert.match(m!.notes.join(), /KHR only/);
});
