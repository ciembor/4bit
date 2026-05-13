import { colorHex, paletteColorNames } from './shared';

export function serializeTermite(colors) {
  let out = '';

  out += '[colors]\n';
  out += `foreground = ${colorHex(colors.foreground)}\n`;
  out += `background = ${colorHex(colors.background)}\n`;
  out += `cursor = ${colorHex(colors.foreground)}\n`;
  out += `cursor_foreground = ${colorHex(colors.background)}\n\n`;

  paletteColorNames().forEach((name, index) => {
    out += `color${index} = ${colorHex(colors[name])}\n`;
  });

  return out;
}
