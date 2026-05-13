import { COLOR_NAMES, colorRgb } from './shared';

function kittyLine(name, value) {
  return `${name}\\${value}\\\n`;
}

export function serializeKitty(colors) {
  let out = '';

  out += kittyLine('Colour0', colorRgb(colors.foreground));
  out += kittyLine('Colour1', colorRgb(colors.foreground));
  out += kittyLine('Colour2', colorRgb(colors.background));
  out += kittyLine('Colour3', colorRgb(colors.background));
  out += kittyLine('Colour4', colorRgb(colors.background));
  out += kittyLine('Colour5', colorRgb(colors.foreground));

  COLOR_NAMES.forEach((name, index) => {
    out += kittyLine(`Colour${index + 6}`, colorRgb(colors[name]));
  });

  return out;
}
