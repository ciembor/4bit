import { COLOR_NAMES, colorRgb, minttyName } from './shared';

export function serializeMintty(colors) {
  let out = '';

  out += `BackgroundColour=${colorRgb(colors.background)}\n`;
  out += `ForegroundColour=${colorRgb(colors.foreground)}\n`;
  out += `CursorColour=${colorRgb(colors.foreground)}\n`;

  COLOR_NAMES.forEach((name) => {
    out += `${minttyName(name)}=${colorRgb(colors[name])}\n`;
  });

  return out;
}
