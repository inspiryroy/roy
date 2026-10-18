// CRC-16/CCITT-FALSE (poly 0x1021, init 0xFFFF, no reflection, no xorout),
// as required by EMVCo MPM §4.7.3 for data object ID "63".
// The checksum covers every byte of the payload up to and including "6304".

const TABLE: Uint16Array = (() => {
  const t = new Uint16Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i << 8;
    for (let j = 0; j < 8; j++) {
      c = c & 0x8000 ? ((c << 1) ^ 0x1021) & 0xffff : (c << 1) & 0xffff;
    }
    t[i] = c;
  }
  return t;
})();

export function crc16ccitt(bytes: Uint8Array): number {
  let crc = 0xffff;
  for (const b of bytes) {
    crc = ((crc << 8) & 0xffff) ^ TABLE[((crc >> 8) ^ b) & 0xff]!;
  }
  return crc;
}

/** CRC of a UTF-8 string, returned as 4 uppercase hex characters. */
export function crcHex(text: string): string {
  return crc16ccitt(new TextEncoder().encode(text)).toString(16).toUpperCase().padStart(4, '0');
}
