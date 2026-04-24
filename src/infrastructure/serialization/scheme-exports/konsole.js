import {
  COLOR_NAMES,
  colorRgb,
  colorSlotNumber,
  schemeName,
} from './shared';

export function serializeKonsole(colors) {
  let out = '';
  const transparencyBlock = 'Transparency=false\n\n';
  const name = schemeName(colors);

  out += '# --- ~/.kde/share/apps/konsole/NAME.colorscheme -------------------------------\n';
  out += '# ------------------------------------------------------------------------------\n';
  out += '# --- generated with 4bit Terminal Color Scheme Designer -----------------------\n';
  out += '# ------------------------------------------------------------------------------\n';
  out += '# --- http://ciembor.github.io/4bit --------------------------------------------\n';
  out += '# ------------------------------------------------------------------------------\n\n';

  out += '# --- special colors ---\n\n';
  out += '[Background]\n';
  out += `Color=${colorRgb(colors.background)}\n`;
  out += transparencyBlock;
  out += '[BackgroundIntense]\n';
  out += `color=${colorRgb(colors.background)}\n`;
  out += transparencyBlock;
  out += '[Foreground]\n';
  out += `Color=${colorRgb(colors.foreground)}\n`;
  out += transparencyBlock;
  out += '[ForegroundIntense]\n';
  out += `Color=${colorRgb(colors.foreground)}\n`;
  out += 'Bold=true\n';
  out += transparencyBlock;

  out += '# --- standard colors ---\n\n';
  COLOR_NAMES.forEach((name, index) => {
    const number = colorSlotNumber(name, index);
    let colorSuffix = number % 8;

    if (number > 7) {
      colorSuffix = `${number % 8}Intense`;
    }

    out += `[Color${colorSuffix}]\n`;
    out += `Color=${colorRgb(colors[name])}\n`;
    out += transparencyBlock;
  });

  out += '# --- general options ---\n\n';
  out += `[General]\nDescription=${name}\nOpacity=1\n`;

  return out;
}
