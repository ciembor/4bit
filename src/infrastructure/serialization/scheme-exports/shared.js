import { COLOR_NAMES } from '../../../domain/scheme/color-names';

export { COLOR_NAMES };

export function isBrightColorName(name) {
  return name.startsWith('bright');
}

export function standardColorNames() {
  return COLOR_NAMES.filter((name) => !isBrightColorName(name));
}

export function brightColorNames() {
  return COLOR_NAMES.filter((name) => isBrightColorName(name));
}

export function paletteColorNames() {
  return [...standardColorNames(), ...brightColorNames()];
}

export function normalColorName(name) {
  if (!isBrightColorName(name)) {
    return name;
  }

  return name.charAt('bright'.length).toLowerCase() + name.slice('bright'.length + 1);
}

export function colorSlotNumber(name, index) {
  let number = index / 2;

  if (isBrightColorName(name)) {
    number += 7.5;
  }

  return number;
}

export function colorHex(color) {
  return color.hex();
}

export function colorRgb(color) {
  return color
    .rgb()
    .array()
    .map((value) => Math.round(value))
    .join(',');
}

export function gnomeColor(color) {
  return colorHex(color).replace(/#(.{2})(.{2})(.{2})/, '#$1$1$2$2$3$3');
}

export function schemeName(colors) {
  return `4bit-${colorHex(colors.foreground)}-on-${colorHex(colors.background)}`.replace(/#/g, '');
}

export function colorKeyDict(colors, colorName, keyName) {
  const rgbArray = colors[colorName].rgb().array();
  let out = '';

  out += `\t<key>${keyName} Color</key>\n`;
  out += '\t<dict>\n';
  out += '\t\t<key>Blue Component</key>\n';
  out += `\t\t<real>${rgbArray[2] / 255}</real>\n`;
  out += '\t\t<key>Green Component</key>\n';
  out += `\t\t<real>${rgbArray[1] / 255}</real>\n`;
  out += '\t\t<key>Red Component</key>\n';
  out += `\t\t<real>${rgbArray[0] / 255}</real>\n`;
  out += '\t</dict>\n';

  return out;
}

export function minttyName(name) {
  if (isBrightColorName(name)) {
    return `Bold${name.slice('bright'.length)}`;
  }

  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function shellScriptPreamble() {
  let out = '';

  out += '#!/bin/bash \n\n';
  out += '# Save this script into set_colors.sh, make this file executable and run it: \n';
  out += '# \n';
  out += '# $ chmod +x set_colors.sh \n';
  out += '# $ ./set_colors.sh \n';
  out += '# \n';
  out += '# Alternatively copy lines below directly into your shell. \n\n';

  return out;
}
