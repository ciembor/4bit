import { describe, expect, it } from 'vitest';
import Color from 'color';
import { bytesToAscii } from '../../../src/infrastructure/serialization/scheme-exports/macos-terminal/lib/byte-strings';
import { BinaryPlistData, BinaryPlistUid, encodeBinaryPlist } from '../../../src/infrastructure/serialization/scheme-exports/macos-terminal/lib/binary-plist';
import { encodeNsColorArchive, nsColorRgbString } from '../../../src/infrastructure/serialization/scheme-exports/macos-terminal/lib/ns-color-archive';

describe('macOS Terminal serialization internals', () => {
  it('writes the binary plist header and trailer for a simple dictionary', () => {
    const bytes = encodeBinaryPlist({
      name: '4bit',
      count: 2,
      payload: new BinaryPlistData(new Uint8Array([1, 2, 3])),
      ref: new BinaryPlistUid(1),
    });

    expect(bytesToAscii(bytes.slice(0, 8))).toBe('bplist00');
    expect(bytes.length).toBeGreaterThan(40);
    expect(bytes[bytes.length - 32 + 6]).toBeGreaterThan(0);
    expect(bytes[bytes.length - 32 + 7]).toBeGreaterThan(0);
  });

  it('formats NSColor RGB components for Terminal.app archives', () => {
    expect(nsColorRgbString(Color('#000000'))).toBe('0 0 0\0');
    expect(nsColorRgbString(Color('#FFFFFF'))).toBe('1 1 1\0');
    expect(nsColorRgbString(Color('#990000'))).toBe('0.6000000238 0 0\0');
    expect(nsColorRgbString(Color('#E5E5E5'))).toBe('0.8980392218 0.8980392218 0.8980392218\0');
  });

  it('encodes NSColor archives as binary plists', () => {
    const bytes = encodeNsColorArchive(Color('#000000'));

    expect(bytesToAscii(bytes.slice(0, 8))).toBe('bplist00');
    expect(bytesToAscii(bytes)).toContain('NSKeyedArchiver');
    expect(bytesToAscii(bytes)).toContain('NSColor');
    expect(bytesToAscii(bytes)).toContain('0 0 0\0');
  });
});
