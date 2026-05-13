import { bytesToBase64 } from './lib/byte-strings';
import { encodeNsColorArchive } from './lib/ns-color-archive';

const TERMINAL_COLOR_KEYS = [
  ['black', 'ANSIBlackColor'],
  ['red', 'ANSIRedColor'],
  ['green', 'ANSIGreenColor'],
  ['yellow', 'ANSIYellowColor'],
  ['blue', 'ANSIBlueColor'],
  ['magenta', 'ANSIMagentaColor'],
  ['cyan', 'ANSICyanColor'],
  ['white', 'ANSIWhiteColor'],
  ['brightBlack', 'ANSIBrightBlackColor'],
  ['brightRed', 'ANSIBrightRedColor'],
  ['brightGreen', 'ANSIBrightGreenColor'],
  ['brightYellow', 'ANSIBrightYellowColor'],
  ['brightBlue', 'ANSIBrightBlueColor'],
  ['brightMagenta', 'ANSIBrightMagentaColor'],
  ['brightCyan', 'ANSIBrightCyanColor'],
  ['brightWhite', 'ANSIBrightWhiteColor'],
  ['background', 'BackgroundColor'],
  ['foreground', 'TextColor'],
  ['foreground', 'TextBoldColor'],
  ['foreground', 'CursorColor'],
  ['brightBlack', 'SelectionColor'],
];

function dataElement(bytes) {
  return `\t<data>${bytesToBase64(bytes)}</data>\n`;
}

function colorDataEntry(colors, colorName, terminalKey) {
  let out = '';

  out += `\t<key>${terminalKey}</key>\n`;
  out += dataElement(encodeNsColorArchive(colors[colorName]));

  return out;
}

export function serializeMacosTerminal(colors) {
  let out = '';

  out += '<?xml version="1.0" encoding="UTF-8"?>\n';
  out += '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n';
  out += '<plist version="1.0">\n';
  out += '<dict>\n';
  out += '\t<key>ProfileCurrentVersion</key>\n';
  out += '\t<real>2.04</real>\n';
  out += '\t<key>name</key>\n';
  out += '\t<string>4bit</string>\n';
  out += '\t<key>type</key>\n';
  out += '\t<string>Window Settings</string>\n';

  TERMINAL_COLOR_KEYS.forEach(([colorName, terminalKey]) => {
    out += colorDataEntry(colors, colorName, terminalKey);
  });

  out += '</dict>\n';
  out += '</plist>\n';

  return out;
}
