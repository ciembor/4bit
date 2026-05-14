import { describe, expect, it } from 'vitest';
import {
  TERMINAL_PREVIEW_COLUMNS,
  TERMINAL_PREVIEW_ROWS,
  TERMINAL_PREVIEW_SAMPLE_TEXT,
  terminalPreviewHeaderLines,
  terminalPreviewPromptCommand,
} from '../../../src/domain/terminal-preview/terminal-preview-model';

describe('TerminalPreviewModel', () => {
  it('preserves the visible shell intro and prompt command', () => {
    expect(terminalPreviewHeaderLines()).toEqual([
      'Welcome to 4bit, the Terminal Color Scheme Designer.',
      'Type help to see available commands.',
    ]);
    expect(terminalPreviewPromptCommand()).toEqual({
      user: 'ciembor',
      host: 'browser',
      directory: '~',
      command: 'colors',
    });
    expect(TERMINAL_PREVIEW_SAMPLE_TEXT).toBe('gYw');
  });

  it('preserves terminal preview background columns', () => {
    expect(TERMINAL_PREVIEW_COLUMNS.map((column) => column.colorName)).toEqual([
      'background',
      'black',
      'red',
      'green',
      'yellow',
      'blue',
      'magenta',
      'cyan',
      'white',
    ]);
    expect(TERMINAL_PREVIEW_COLUMNS.map((column) => column.label)).toEqual([
      ' ',
      '40m',
      '41m',
      '42m',
      '43m',
      '44m',
      '45m',
      '46m',
      '47m',
    ]);
  });

  it('preserves terminal preview foreground rows', () => {
    expect(TERMINAL_PREVIEW_ROWS.map((row) => row.colorName)).toEqual([
      'foreground',
      'brightForeground',
      'black',
      'brightBlack',
      'red',
      'brightRed',
      'green',
      'brightGreen',
      'yellow',
      'brightYellow',
      'blue',
      'brightBlue',
      'magenta',
      'brightMagenta',
      'cyan',
      'brightCyan',
      'white',
      'brightWhite',
    ]);
    expect(TERMINAL_PREVIEW_ROWS.map((row) => row.label)).toEqual([
      'm',
      '1m',
      '30m',
      '1;30m',
      '31m',
      '1;31m',
      '32m',
      '1;32m',
      '33m',
      '1;33m',
      '34m',
      '1;34m',
      '35m',
      '1;35m',
      '36m',
      '1;36m',
      '37m',
      '1;37m',
    ]);
  });
});
