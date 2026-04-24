import { gnomeColor, paletteColorNames, shellScriptPreamble } from './shared';

export function serializeGuake(colors) {
  const palette = paletteColorNames().map((name) => gnomeColor(colors[name]));
  let out = shellScriptPreamble();

  palette.push(gnomeColor(colors.foreground));
  palette.push(gnomeColor(colors.background));

  out += `dconf write /apps/guake/style/font/palette "'${palette.join(':')}'"\n`;
  out += `dconf write /apps/guake/style/font/palette-name "'4bit Color Scheme Designer'"\n`;

  return out;
}
