import { colorHex } from './shared';

const CONEMU_COLOR_NAMES = [
  'black',
  'blue',
  'green',
  'cyan',
  'red',
  'magenta',
  'yellow',
  'white',
  'brightBlack',
  'brightBlue',
  'brightGreen',
  'brightCyan',
  'brightRed',
  'brightMagenta',
  'brightYellow',
  'brightWhite',
];

const EXTENDED_COLOR_TABLE = [
  '00000000',
  '00800000',
  '00008000',
  '00808000',
  '00000080',
  '00800080',
  '00008080',
  '00c0c0c0',
  '00808080',
  '00ff0000',
  '0000ff00',
  '00ffff00',
  '000000ff',
  '00ff00ff',
  '0000ffff',
  '00ffffff',
];

function padDatePart(value) {
  return String(value).padStart(2, '0');
}

function conEmuModifiedDate(date) {
  return [
    date.getUTCFullYear(),
    padDatePart(date.getUTCMonth() + 1),
    padDatePart(date.getUTCDate()),
  ].join('-') + ' ' + [
    padDatePart(date.getUTCHours()),
    padDatePart(date.getUTCMinutes()),
    padDatePart(date.getUTCSeconds()),
  ].join(':');
}

export function bgrHex(color) {
  const hex = colorHex(color);

  return `${hex.slice(5, 7)}${hex.slice(3, 5)}${hex.slice(1, 3)}`;
}

function colorTableValue(index, data) {
  return `\t<value name="ColorTable${String(index).padStart(2, '0')}" type="dword" data="${data}"/>\n`;
}

export function serializeConEmu(colors) {
  const date = new Date(Date.now());
  let out = '';

  out += `<key name="Palette1" modified="${conEmuModifiedDate(date)}" build="180131">\n`;
  out += `\t<value name="Name" type="string" data="4bit generated ${Math.floor(date.getTime() / 1000)}" />\n`;
  out += '\t<value name="ExtendColors" type="hex" data="00" />\n';
  out += '\t<value name="ExtendColorIdx" type="hex" data="0E" />\n';
  out += '\t<value name="TextColorIdx" type="hex" data="10"/>\n';
  out += '\t<value name="BackColorIdx" type="hex" data="10"/>\n';
  out += '\t<value name="PopTextColorIdx" type="hex" data="10"/>\n';
  out += '\t<value name="PopBackColorIdx" type="hex" data="10"/>\n';

  CONEMU_COLOR_NAMES.forEach((name, index) => {
    out += colorTableValue(index, `00${bgrHex(colors[name])}`);
  });

  EXTENDED_COLOR_TABLE.forEach((data, index) => {
    out += colorTableValue(index + 16, data);
  });

  out += '</key>';

  return out;
}
