import { COLOR_NAMES, colorRgb } from './shared';

export function serializePutty(colors) {
  let out = '';
  let counter = 6;

  out += 'Windows Registry Editor Version 5.00 \n\n';
  out += '[HKEY_CURRENT_USER\\Software\\SimonTatham\\PuTTY\\Sessions\\Default%20Settings]\n';
  out += `"Colour0"="${colorRgb(colors.foreground)}"\n`;
  out += `"Colour1"="${colorRgb(colors.foreground)}"\n`;
  out += `"Colour2"="${colorRgb(colors.background)}"\n`;
  out += `"Colour3"="${colorRgb(colors.background)}"\n`;
  out += `"Colour4"="${colorRgb(colors.background)}"\n`;
  out += `"Colour5"="${colorRgb(colors.foreground)}"\n`;

  COLOR_NAMES.forEach((name) => {
    out += `"Colour${counter}"="${colorRgb(colors[name])}"\n`;
    counter += 1;
  });

  return out;
}
