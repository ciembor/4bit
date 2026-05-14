function colorHex(colors, name) {
  return colors[name]?.hex?.() ?? '#000000';
}

export function xtermThemeFromScheme(colors) {
  return {
    background: colorHex(colors, 'background'),
    foreground: colorHex(colors, 'foreground'),
    cursor: colorHex(colors, 'foreground'),
    selectionBackground: colorHex(colors, 'brightBlack'),
    black: colorHex(colors, 'black'),
    red: colorHex(colors, 'red'),
    green: colorHex(colors, 'green'),
    yellow: colorHex(colors, 'yellow'),
    blue: colorHex(colors, 'blue'),
    magenta: colorHex(colors, 'magenta'),
    cyan: colorHex(colors, 'cyan'),
    white: colorHex(colors, 'white'),
    brightBlack: colorHex(colors, 'brightBlack'),
    brightRed: colorHex(colors, 'brightRed'),
    brightGreen: colorHex(colors, 'brightGreen'),
    brightYellow: colorHex(colors, 'brightYellow'),
    brightBlue: colorHex(colors, 'brightBlue'),
    brightMagenta: colorHex(colors, 'brightMagenta'),
    brightCyan: colorHex(colors, 'brightCyan'),
    brightWhite: colorHex(colors, 'brightWhite'),
  };
}
