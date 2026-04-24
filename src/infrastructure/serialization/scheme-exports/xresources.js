import { COLOR_NAMES, colorHex, colorSlotNumber } from './shared';

export function serializeXresources(colors) {
  let out = '';

  out += '! --- ~/.Xresources ------------------------------------------------------------\n';
  out += '! ------------------------------------------------------------------------------\n';
  out += '! --- generated with 4bit Terminal Color Scheme Designer -----------------------\n';
  out += '! ------------------------------------------------------------------------------\n';
  out += '! --- http://ciembor.github.io/4bit --------------------------------------------\n';
  out += '! ------------------------------------------------------------------------------\n\n';

  out += '! --- special colors ---\n\n';
  out += `*background: ${colorHex(colors.background)}\n`;
  out += `*foreground: ${colorHex(colors.foreground)}\n\n`;

  out += '! --- standard colors ---\n\n';
  COLOR_NAMES.forEach((name, index) => {
    const number = colorSlotNumber(name, index);

    out += `! ${name}\n`;
    out += `*color${number}: ${colorHex(colors[name])}\n\n`;
  });

  out += '\n! ------------------------------------------------------------------------------\n';
  out += '! --- end of terminal colors section -------------------------------------------\n';
  out += '! ------------------------------------------------------------------------------\n\n';

  return out;
}
