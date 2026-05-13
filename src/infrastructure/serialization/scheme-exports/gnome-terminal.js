import { colorHex, paletteColorNames, shellScriptPreamble } from './shared';

function gvariantString(value) {
  return `"'${value}'"`;
}

function gvariantStringArray(values) {
  return `"[${
    values.map((value) => `'${value}'`).join(', ')
  }]"`;
}

export function serializeGnomeTerminal(colors) {
  const palette = paletteColorNames().map((name) => colorHex(colors[name]));
  let out = shellScriptPreamble();

  out += 'PROFILE_ID=$(gsettings get org.gnome.Terminal.ProfilesList default | tr -d "\'")\n';
  out += 'PROFILE_PATH="/org/gnome/terminal/legacy/profiles:/:${PROFILE_ID}/"\n\n';

  out += 'if [ -z "$PROFILE_ID" ]; then\n';
  out += '  echo "Could not detect the default GNOME Terminal profile." >&2\n';
  out += '  exit 1\n';
  out += 'fi\n\n';

  out += 'dconf write "${PROFILE_PATH}use-theme-colors" false\n';
  out += `dconf write "\${PROFILE_PATH}background-color" ${gvariantString(colorHex(colors.background))}\n`;
  out += `dconf write "\${PROFILE_PATH}foreground-color" ${gvariantString(colorHex(colors.foreground))}\n`;
  out += `dconf write "\${PROFILE_PATH}palette" ${gvariantStringArray(palette)}\n`;

  return out;
}
