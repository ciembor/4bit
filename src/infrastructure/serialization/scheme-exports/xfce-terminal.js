import { colorHex, paletteColorNames } from './shared';

export function serializeXfceTerminal(colors) {
  const palette = paletteColorNames().map((name) => colorHex(colors[name]));
  let out = '[Scheme]\n';

  out += 'Name=4bit-terminal-color-scheme-designer\n';
  out += `ColorBackground=${colorHex(colors.background)}\n`;
  out += `ColorForeground=${colorHex(colors.foreground)}\n`;
  out += `ColorCursor=${colorHex(colors.foreground)}\n`;
  out += `ColorPalette=${palette.join(';')}`;

  return out;
}
