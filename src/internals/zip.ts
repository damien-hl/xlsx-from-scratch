import { crc32 } from "./crc";
import type { FileEntry } from "./types";
import { concatUint8, dateToDos, utf8 } from "./helpers";

/**
 * Creates a ZIP file from an array of file entries.
 * 
 * @param files - An array of file entries to include in the ZIP file.
 * 
 * @returns A Uint8Array representing the ZIP file.
 */
export function createZip(
  files: FileEntry[]
): Uint8Array {
  const fileRecords: Uint8Array[] = [];
  const centralDirectory: Uint8Array[] = [];

  let offset = 0;
  const now = new Date();

  for (const file of files) {
    const data = utf8(file.content);
    const filenameBytes = utf8(file.path);
    const { time, date } = dateToDos(now);
    const crc = crc32(data);

    // Local file header signature
    const localHeader = new Uint8Array(30 + filenameBytes.length);
    const localView = new DataView(localHeader.buffer);

    localView.setUint32(0, 0x04034b50, true); // Local file header signature
    localView.setUint16(4, 20, true); // Version needed to extract
    localView.setUint16(6, 0, true); // General purpose bit flag
    localView.setUint16(8, 0, true); // Compression method
    localView.setUint16(10, time, true); // Last mod file time
    localView.setUint16(12, date, true); // Last mod file date
    localView.setUint32(14, crc, true); // CRC-32
    localView.setUint32(18, file.content.length, true); // Compressed size
    localView.setUint32(22, file.content.length, true); // Uncompressed size
    localView.setUint16(26, filenameBytes.length, true); // File name length
    localView.setUint16(28, 0, true); // Extra field length

    localHeader.set(filenameBytes, 30);

    fileRecords.push(localHeader, data);

    // Central directory file header
    const centralHeader = new Uint8Array(46 + filenameBytes.length);
    const centralView = new DataView(centralHeader.buffer);

    centralView.setUint32(0, 0x02014b50, true); // Central directory file header signature
    centralView.setUint16(4, 20, true); // Version made by
    centralView.setUint16(6, 20, true); // Version needed to extract
    centralView.setUint16(8, 0, true); // General purpose bit flag
    centralView.setUint16(10, 0, true); // Compression method
    centralView.setUint16(12, time, true); // Last mod file time
    centralView.setUint16(14, date, true); // Last mod file date
    centralView.setUint32(16, crc, true); // CRC-32
    centralView.setUint32(20, file.content.length, true); // Compressed size
    centralView.setUint32(24, file.content.length, true); // Uncompressed size
    centralView.setUint16(28, filenameBytes.length, true); // File name length
    centralView.setUint16(30, 0, true); // Extra field length
    centralView.setUint16(32, 0, true); // File comment length
    centralView.setUint16(34, 0, true); // Disk number start
    centralView.setUint16(36, 0, true); // Internal file attributes
    centralView.setUint32(38, 0, true); // External file attributes
    centralView.setUint32(42, offset, true); // Relative offset of local header

    centralHeader.set(filenameBytes, 46);

    centralDirectory.push(centralHeader);
    offset += localHeader.length + data.length;
  }

  const centralSize = centralDirectory.reduce((sum, b) => sum + b.length, 0);
  const centralOffset = offset;
  
  // Central directory
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);

  // End of central directory signature
  endView.setUint32(0, 0x06054b50, true); // End of central directory signature
  endView.setUint16(4, 0, true); // Number of this disk
  endView.setUint16(6, 0, true); // Number of the disk with the start of the central directory
  endView.setUint16(8, centralDirectory.length, true); // Total number of entries in the central directory on this disk
  endView.setUint16(10, centralDirectory.length, true); // Total number of entries in the central directory
  endView.setUint32(12, centralSize, true); // Size of the central directory
  endView.setUint32(16, centralOffset, true); // Offset of start of central directory with respect to the starting disk number
  endView.setUint16(20, 0, true); // .ZIP file comment length

  return concatUint8([
    ...fileRecords,
    ...centralDirectory,
    end
  ]);
}
