import {
  brightColorNames,
  colorHex,
  normalColorName,
  standardColorNames,
} from './shared';

export function serializeAlacritty(colors) {
  let out = '';

  out += '# --- ~/.config/alacritty/alacritty.yml ----------------------------------------\n';
  out += '# ------------------------------------------------------------------------------\n';
  out += '# --- generated with 4bit Terminal Color Scheme Designer -----------------------\n';
  out += '# ------------------------------------------------------------------------------\n';
  out += '# --- https://ciembor.github.io/4bit -------------------------------------------\n';
  out += '# ------------------------------------------------------------------------------\n\n';
  out += 'colors:\n';
  out += '  primary:\n';
  out += `    background: '0x${colorHex(colors.background).slice(1)}'\n`;
  out += `    foreground: '0x${colorHex(colors.foreground).slice(1)}'\n\n`;
  out += '  normal:\n';

  standardColorNames().forEach((name) => {
    out += `    ${name}: '0x${colorHex(colors[name]).slice(1)}'\n`;
  });

  out += '\n  bright:\n';
  brightColorNames().forEach((name) => {
    out += `    ${normalColorName(name)}: '0x${colorHex(colors[name]).slice(1)}'\n`;
  });

  out += '\n# ------------------------------------------------------------------------------\n';
  out += '# --- end of terminal colors section -------------------------------------------\n';
  out += '# ------------------------------------------------------------------------------\n\n';

  return out;
}
