/**
 * Converts a string to a Uint8Array using UTF-8 encoding.
 * This is useful for encoding text data for various purposes, such as
 * creating ZIP files or other binary formats.
 * 
 * @param str - The string to convert.
 * 
 * @returns A Uint8Array representing the UTF-8 encoded string.
 */
export function utf8(
  str: string
): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

/**
 * Escapes special XML characters in a string to ensure it is safe for XML
 * serialization. This is useful for creating XML documents or elements
 * without risking invalid characters.
 * 
 * @param str - The string to escape.
 * 
 * @returns A string with special XML characters replaced by their escaped
 *          equivalents.
 */
export function escapeXml(
  str: string
): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Converts a Date object to a DOS date and time format.
 * This is useful for creating ZIP files or other binary formats
 * that require DOS date and time representation.
 * 
 * @param date - The Date object to convert.
 * 
 * @returns An object containing the time and date in DOS format.
 */
export function dateToDos(
  date: Date
): { time: number; date: number } {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() / 2);
  const day = (date.getFullYear() - 1980) << 9 | ((date.getMonth() + 1) << 5) | date.getDate();
  
  return { time: time & 0xffff, date: day & 0xffff };
}

/**
 * Concatenates an array of Uint8Arrays into a single Uint8Array.
 * This is useful for combining binary data from multiple sources
 * into a single buffer.
 * 
 * @param arrays - An array of Uint8Arrays to concatenate.
 * 
 * @returns A new Uint8Array containing the concatenated data.
 */
export function concatUint8(
  arrays: Uint8Array[]
): Uint8Array {
  const total = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(total);

  let offset = 0;

  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }

  return result;
}
