import { colorHex } from './shared';

export function serializeWindowsTerminal(colors) {
  return JSON.stringify({
    name: '4bit',
    black: colorHex(colors.black),
    red: colorHex(colors.red),
    green: colorHex(colors.green),
    yellow: colorHex(colors.yellow),
    blue: colorHex(colors.blue),
    purple: colorHex(colors.magenta),
    cyan: colorHex(colors.cyan),
    white: colorHex(colors.white),
    brightBlack: colorHex(colors.brightBlack),
    brightRed: colorHex(colors.brightRed),
    brightGreen: colorHex(colors.brightGreen),
    brightYellow: colorHex(colors.brightYellow),
    brightBlue: colorHex(colors.brightBlue),
    brightPurple: colorHex(colors.brightMagenta),
    brightCyan: colorHex(colors.brightCyan),
    brightWhite: colorHex(colors.brightWhite),
    background: colorHex(colors.background),
    foreground: colorHex(colors.foreground),
    cursorColor: colorHex(colors.foreground),
    selectionBackground: colorHex(colors.brightBlack),
  }, null, 2);
}
