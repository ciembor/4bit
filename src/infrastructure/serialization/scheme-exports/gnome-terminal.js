import { gnomeColor, paletteColorNames, shellScriptPreamble } from './shared';

export function serializeGnomeTerminal(colors) {
  const palette = paletteColorNames().map((name) => gnomeColor(colors[name]));
  let out = shellScriptPreamble();

  out += 'gconftool-2 --set /apps/gnome-terminal/profiles/Default/use_theme_background --type bool false \n';
  out += 'gconftool-2 --set /apps/gnome-terminal/profiles/Default/use_theme_colors --type bool false \n';
  out += `gconftool-2 -s -t string /apps/gnome-terminal/profiles/Default/background_color '${gnomeColor(colors.background)}'\n`;
  out += `gconftool-2 -s -t string /apps/gnome-terminal/profiles/Default/foreground_color '${gnomeColor(colors.foreground)}'\n`;
  out += `gconftool-2 -s -t string /apps/gnome-terminal/profiles/Default/palette '${palette.join(':')}'\n`;

  return out;
}
