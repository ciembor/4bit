import {
  COLOR_NAMES,
  colorHex,
  isBrightColorName,
  normalColorName,
} from './shared';

export function serializeTerminator(colors) {
  const paletteNormal = [];
  const paletteBright = [];
  const name = `4bit-${Date.now()}`;
  let out = '';

  COLOR_NAMES.forEach((colorName) => {
    if (isBrightColorName(colorName)) {
      paletteBright.push(colorHex(colors[colorName]));
      paletteNormal.push(colorHex(colors[normalColorName(colorName)]));
    }
  });

  out += '# Color scheme configuration for Terminator terminal emulator (http://gnometerminator.blogspot.com/p/introduction.html and https://launchpad.net/terminator)\n';
  out += '# \n';
  out += '# Copy the following lines within the [profiles] section of terminator configuration file at ~/.config/terminator/config\n\n';
  out += `[[${name}]]\n`;
  out += '  use_theme_colors = False\n';
  out += `  background_color = "${colorHex(colors.background)}"\n`;
  out += `  foreground_color = "${colorHex(colors.foreground)}"\n`;
  out += `  palette = "${paletteNormal.concat(paletteBright).join(':')}"\n`;

  return out;
}
