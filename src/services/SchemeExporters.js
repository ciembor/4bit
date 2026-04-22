import { COLOR_NAMES } from '../constants';

const TEXT_MIME_TYPE = 'text/plain;charset=utf-8';
const XML_MIME_TYPE = 'application/xml;charset=utf-8';

function isBrightColorName(name) {
  return name.startsWith('bright');
}

function standardColorNames() {
  return COLOR_NAMES.filter((name) => !isBrightColorName(name));
}

function brightColorNames() {
  return COLOR_NAMES.filter((name) => isBrightColorName(name));
}

function normalColorName(name) {
  if (!isBrightColorName(name)) {
    return name;
  }

  return name.charAt('bright'.length).toLowerCase() + name.slice('bright'.length + 1);
}

function colorHex(color) {
  return color.hex();
}

function colorRgb(color) {
  return color
    .rgb()
    .array()
    .map((value) => Math.round(value))
    .join(',');
}

function gnomeColor(color) {
  return colorHex(color).replace(/#(.{2})(.{2})(.{2})/, '#$1$1$2$2$3$3');
}

function schemeName(colors) {
  return `4bit-${colorHex(colors.foreground)}-on-${colorHex(colors.background)}`.replace(/#/g, '');
}

function colorKeyDict(colors, colorName, keyName) {
  const rgbArray = colors[colorName].rgb().array();
  let out = '';

  out += `\t<key>${keyName} Color</key>\n`;
  out += '\t<dict>\n';
  out += '\t\t<key>Blue Component</key>\n';
  out += `\t\t<real>${rgbArray[2] / 255}</real>\n`;
  out += '\t\t<key>Green Component</key>\n';
  out += `\t\t<real>${rgbArray[1] / 255}</real>\n`;
  out += '\t\t<key>Red Component</key>\n';
  out += `\t\t<real>${rgbArray[0] / 255}</real>\n`;
  out += '\t</dict>\n';

  return out;
}

function minttyName(name) {
  if (isBrightColorName(name)) {
    return `Bold${name.slice('bright'.length)}`;
  }

  return name.charAt(0).toUpperCase() + name.slice(1);
}

function buildGuake(colors) {
  const palette = [
    ...standardColorNames(),
    ...brightColorNames(),
  ].map((name) => gnomeColor(colors[name]));
  let out = '';

  palette.push(gnomeColor(colors.foreground));
  palette.push(gnomeColor(colors.background));

  out += '#!/bin/bash \n\n';
  out += '# Save this script into set_colors.sh, make this file executable and run it: \n';
  out += '# \n';
  out += '# $ chmod +x set_colors.sh \n';
  out += '# $ ./set_colors.sh \n';
  out += '# \n';
  out += '# Alternatively copy lines below directly into your shell. \n\n';

  out += `dconf write /apps/guake/style/font/palette "'${palette.join(':')}'"\n`;
  out += `dconf write /apps/guake/style/font/palette-name "'4bit Color Scheme Designer'"\n`;

  return out;
}

function buildGnomeTerminal(colors) {
  const palette = [
    ...standardColorNames(),
    ...brightColorNames(),
  ].map((name) => gnomeColor(colors[name]));
  let out = '';

  out += '#!/bin/bash \n\n';
  out += '# Save this script into set_colors.sh, make this file executable and run it: \n';
  out += '# \n';
  out += '# $ chmod +x set_colors.sh \n';
  out += '# $ ./set_colors.sh \n';
  out += '# \n';
  out += '# Alternatively copy lines below directly into your shell. \n\n';

  out += 'gconftool-2 --set /apps/gnome-terminal/profiles/Default/use_theme_background --type bool false \n';
  out += 'gconftool-2 --set /apps/gnome-terminal/profiles/Default/use_theme_colors --type bool false \n';
  out += `gconftool-2 -s -t string /apps/gnome-terminal/profiles/Default/background_color '${gnomeColor(colors.background)}'\n`;
  out += `gconftool-2 -s -t string /apps/gnome-terminal/profiles/Default/foreground_color '${gnomeColor(colors.foreground)}'\n`;
  out += `gconftool-2 -s -t string /apps/gnome-terminal/profiles/Default/palette '${palette.join(':')}'\n`;

  return out;
}

function buildKonsole(colors) {
  let out = '';
  let counter = 0;
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
  COLOR_NAMES.forEach((name) => {
    let number = counter / 2;
    let colorSuffix = number % 8;

    if (isBrightColorName(name)) {
      number += 7.5;
    }

    if (number > 7) {
      colorSuffix = `${number % 8}Intense`;
    }

    out += `[Color${colorSuffix}]\n`;
    out += `Color=${colorRgb(colors[name])}\n`;
    out += transparencyBlock;
    counter += 1;
  });

  out += '# --- general options ---\n\n';
  out += `[General]\nDescription=${name}\nOpacity=1\n`;

  return out;
}

function buildITerm2(colors) {
  let out = '';
  let counter = 0;
  const name = schemeName(colors);

  out += '<?xml version="1.0" encoding="UTF-8"?>\n';
  out += '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n';
  out += '\n<!--\n\n';
  out += `      Save this file to ${name}.itermcolors                                    \n`;
  out += '      and load it with iTerm2 Preferences panel                                 \n';
  out += '                                                                                \n';
  out += '      generated with 4bit Terminal Color Scheme Designer                        \n';
  out += '                                                                                \n';
  out += '      http://ciembor.github.io/4bit                                             \n';
  out += '                                                                                \n';
  out += '-->\n\n';

  out += '<plist version="1.0">\n';
  out += '<dict>\n';

  out += '<!-- special colors -->\n';
  out += colorKeyDict(colors, 'background', 'Background');
  out += colorKeyDict(colors, 'foreground', 'Foreground');
  out += colorKeyDict(colors, 'foreground', 'Cursor');
  out += colorKeyDict(colors, 'background', 'Cursor Text');

  out += '<!-- standard colors -->\n';
  COLOR_NAMES.forEach((name) => {
    let number = counter / 2;

    if (isBrightColorName(name)) {
      number += 7.5;
    }

    out += `\t<!-- ${name} -->\n`;
    out += colorKeyDict(colors, name, `Ansi ${number}`);
    counter += 1;
  });

  out += '</dict>\n';
  out += '</plist>\n';
  out += '\n';

  return out;
}

function buildXresources(colors) {
  let out = '';
  let counter = 0;

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
  COLOR_NAMES.forEach((name) => {
    let number = counter / 2;

    if (isBrightColorName(name)) {
      number += 7.5;
    }

    out += `! ${name}\n`;
    out += `*color${number}: ${colorHex(colors[name])}\n\n`;
    counter += 1;
  });

  out += '\n! ------------------------------------------------------------------------------\n';
  out += '! --- end of terminal colors section -------------------------------------------\n';
  out += '! ------------------------------------------------------------------------------\n\n';

  return out;
}

function buildXfceTerminal(colors) {
  const palette = [
    ...standardColorNames(),
    ...brightColorNames(),
  ].map((name) => colorHex(colors[name]));
  let out = '[Scheme]\n';

  out += 'Name=4bit-terminal-color-scheme-designer\n';
  out += `ColorBackground=${colorHex(colors.background)}\n`;
  out += `ColorForeground=${colorHex(colors.foreground)}\n`;
  out += `ColorCursor=${colorHex(colors.foreground)}\n`;
  out += `ColorPalette=${palette.join(';')}`;

  return out;
}

function buildAlacritty(colors) {
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

function buildMintty(colors) {
  let out = '';

  out += `BackgroundColour=${colorRgb(colors.background)}\n`;
  out += `ForegroundColour=${colorRgb(colors.foreground)}\n`;
  out += `CursorColour=${colorRgb(colors.foreground)}\n`;

  COLOR_NAMES.forEach((name) => {
    out += `${minttyName(name)}=${colorRgb(colors[name])}\n`;
  });

  return out;
}

function buildPutty(colors) {
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

function buildTerminator(colors) {
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

const EXPORT_BUILDERS = {
  alacritty: buildAlacritty,
  xresources: buildXresources,
  guake: buildGuake,
  gnomeTerminal: buildGnomeTerminal,
  konsole: buildKonsole,
  iTerm2: buildITerm2,
  xfceTerminal: buildXfceTerminal,
  mintty: buildMintty,
  putty: buildPutty,
  terminator: buildTerminator,
};

export const SCHEME_DOWNLOADS = [
  {
    id: 'alacritty',
    buttonId: 'alacritty-button',
    text: 'alacritty',
    linkLabel: 'alacritty.yml',
    downloadName: 'alacritty.yml',
    mimeType: TEXT_MIME_TYPE,
  },
  {
    id: 'xresources',
    buttonId: 'xresources-button',
    text: 'aterm / rxvt / urxvt / xterm',
    linkLabel: '.Xresources',
    downloadName: '.Xresources',
    mimeType: TEXT_MIME_TYPE,
  },
  {
    id: 'gnomeTerminal',
    buttonId: 'gnome-terminal-button',
    text: 'gnome terminal',
    linkLabel: 'shell',
    downloadName: 'set_colors.sh',
    mimeType: TEXT_MIME_TYPE,
  },
  {
    id: 'guake',
    buttonId: 'guake-button',
    text: 'guake',
    linkLabel: 'shell',
    downloadName: 'set_colors.sh',
    mimeType: TEXT_MIME_TYPE,
  },
  {
    id: 'iTerm2',
    buttonId: 'iterm2-button',
    text: 'iTerm2',
    linkLabel: '*.itermcolors',
    downloadName: '4bit.itermcolors',
    mimeType: XML_MIME_TYPE,
  },
  {
    id: 'konsole',
    buttonId: 'konsole-button',
    text: 'konsole / yakuake',
    linkLabel: '*.colorscheme',
    downloadName: '4bit.colorscheme',
    mimeType: TEXT_MIME_TYPE,
  },
  {
    id: 'mintty',
    buttonId: 'mintty-button',
    text: 'mintty',
    linkLabel: '.minttyrc',
    downloadName: '4bit-color-scheme.minttyrc',
    mimeType: TEXT_MIME_TYPE,
  },
  {
    id: 'putty',
    buttonId: 'putty-button',
    text: 'putty',
    linkLabel: '*.reg',
    downloadName: '4bit-putty-color-scheme.reg',
    mimeType: TEXT_MIME_TYPE,
  },
  {
    id: 'terminator',
    buttonId: 'terminator-button',
    text: 'terminator',
    linkLabel: 'config',
    downloadName: 'config',
    mimeType: TEXT_MIME_TYPE,
  },
  {
    id: 'xfceTerminal',
    buttonId: 'xfce-terminal-button',
    text: 'xfce4 terminal',
    linkLabel: '*.scheme',
    downloadName: '4bit.scheme',
    mimeType: TEXT_MIME_TYPE,
  },
];

export function canExportScheme(colors) {
  return ['background', 'foreground', ...COLOR_NAMES].every((name) => colors?.[name]);
}

export function buildSchemeDownload(exportId, colors) {
  const buildContent = EXPORT_BUILDERS[exportId];
  const definition = SCHEME_DOWNLOADS.find((item) => item.id === exportId);

  if (!buildContent || !definition) {
    throw new Error(`Unknown export format: ${exportId}`);
  }

  return new Blob([buildContent(colors)], { type: definition.mimeType });
}
