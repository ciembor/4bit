import { describe, expect, it } from 'vitest';
import {
  joinTerminalLines,
  resetSgr,
  sgr,
  styledText,
  TERMINAL_LINE_BREAK,
} from '../../../src/application/terminal-preview/ansi-terminal-sequence';

describe('ansi-terminal-sequence', () => {
  it('renders SGR styling primitives', () => {
    expect(sgr()).toBe('');
    expect(sgr(1, 32)).toBe('\x1b[1;32m');
    expect(resetSgr()).toBe('\x1b[0m');
    expect(styledText('help', [32])).toBe('\x1b[32mhelp\x1b[0m');
  });

  it('joins terminal lines with CRLF', () => {
    expect(TERMINAL_LINE_BREAK).toBe('\r\n');
    expect(joinTerminalLines(['one', 'two'])).toBe('one\r\ntwo');
  });
});
