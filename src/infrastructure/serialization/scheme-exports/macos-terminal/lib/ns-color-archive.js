import { BinaryPlistData, BinaryPlistUid, encodeBinaryPlist } from './binary-plist';
import { asciiBytes } from './byte-strings';

function colorComponent(value) {
  if (value === 0) {
    return '0';
  }

  if (value === 255) {
    return '1';
  }

  return Math.fround(value / 255).toFixed(10);
}

export function nsColorRgbString(color) {
  const [red, green, blue] = color.rgb().array().map((value) => Math.round(value));

  return `${colorComponent(red)} ${colorComponent(green)} ${colorComponent(blue)}\0`;
}

export function encodeNsColorArchive(color) {
  return encodeBinaryPlist({
    '$version': 100000,
    '$objects': [
      '$null',
      {
        NSRGB: new BinaryPlistData(asciiBytes(nsColorRgbString(color))),
        NSColorSpace: 2,
        '$class': new BinaryPlistUid(2),
      },
      {
        '$classname': 'NSColor',
        '$classes': ['NSColor', 'NSObject'],
      },
    ],
    '$archiver': 'NSKeyedArchiver',
    '$top': {
      root: new BinaryPlistUid(1),
    },
  });
}
