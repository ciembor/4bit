import { describe, expect, it } from 'vitest';
import { buildTerminalPreviewSequence } from '../../../src/application/terminal-preview/build-terminal-preview-sequence';

function stripAnsi(value) {
  return value.replace(/\x1b\[[0-9;]*m/g, '');
}

describe('buildTerminalPreviewSequence', () => {
  it('renders the visible terminal preview content', () => {
    const sequence = buildTerminalPreviewSequence();
    const plainText = stripAnsi(sequence);

    expect(plainText).toContain('Welcome to fish, the friendly interactive shell');
    expect(plainText).toContain('Type help for instructions on how to use fish');
    expect(plainText).toContain('ciembor@browser ~> ./colors.sh');
    expect(plainText).toContain('ciembor@browser ~>');
    expect(plainText).toContain('40m');
  });

  it('renders colored shell prompt segments with SGR resets', () => {
    const sequence = buildTerminalPreviewSequence();

    expect(sequence).toContain('\x1b[32mhelp\x1b[0m');
    expect(sequence).toContain('\x1b[36mciembor\x1b[0m');
    expect(sequence).toContain('\x1b[34m./colors.sh\x1b[0m');
    expect(sequence).toContain('\r\n');
  });
});
