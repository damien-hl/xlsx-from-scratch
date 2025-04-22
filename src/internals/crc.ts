/**
 * Creates a CRC32 table for fast CRC calculation.
 *
 * @returns A Uint32Array representing the CRC32 table.
 */
const crcTable = (() => {
  const table = new Uint32Array(256);

  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }

  return table;
})();

/**
 * Calculates the CRC32 checksum of a given Uint8Array.
 *
 * @param data - The Uint8Array to calculate the CRC32 checksum for.
 * 
 * @returns The CRC32 checksum as a number.
 */
export function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;

  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]!) & 0xff]!;
  }

  return (crc ^ 0xffffffff) >>> 0;
}
