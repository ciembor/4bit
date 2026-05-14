import { describe, expect, it } from 'vitest';
import Color from 'color';
import { terminalViewThemeFromScheme } from '../../../src/presentation/editor-page/terminal-preview/terminal-view-theme';

function createColors() {
  return {
    background: Color('#101010'),
    foreground: Color('#f0f0f0'),
    black: Color('#000000'),
    brightBlack: Color('#808080'),
    red: Color('#cc0000'),
    brightRed: Color('#ff5555'),
    green: Color('#00aa00'),
    brightGreen: Color('#55ff55'),
    yellow: Color('#aa5500'),
    brightYellow: Color('#ffff55'),
    blue: Color('#0000aa'),
    brightBlue: Color('#5555ff'),
    magenta: Color('#aa00aa'),
    brightMagenta: Color('#ff55ff'),
    cyan: Color('#00aaaa'),
    brightCyan: Color('#55ffff'),
    white: Color('#aaaaaa'),
    brightWhite: Color('#ffffff'),
  };
}

describe('terminalViewThemeFromScheme', () => {
  it('maps the 4bit color scheme to a terminal view theme', () => {
    expect(terminalViewThemeFromScheme(createColors())).toEqual({
      background: '#101010',
      foreground: '#F0F0F0',
      cursor: '#F0F0F0',
      selectionBackground: '#808080',
      black: '#000000',
      red: '#CC0000',
      green: '#00AA00',
      yellow: '#AA5500',
      blue: '#0000AA',
      magenta: '#AA00AA',
      cyan: '#00AAAA',
      white: '#AAAAAA',
      brightBlack: '#808080',
      brightRed: '#FF5555',
      brightGreen: '#55FF55',
      brightYellow: '#FFFF55',
      brightBlue: '#5555FF',
      brightMagenta: '#FF55FF',
      brightCyan: '#55FFFF',
      brightWhite: '#FFFFFF',
    });
  });
});
