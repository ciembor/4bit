import { describe, expect, it } from 'vitest';
import { buildColorsPreviewCommand } from '../../../../src/application/terminal-preview/commands/build-colors-preview-command';

function stripAnsi(value) {
  return value.replace(/\x1b\[[0-9;]*m/g, '');
}

describe('buildColorsPreviewCommand', () => {
  it('renders the color table preview as a standalone terminal command result', () => {
    const commandOutput = buildColorsPreviewCommand();
    const plainText = stripAnsi(commandOutput);

    expect(plainText).toContain('40m');
    expect(plainText).toContain('47m');
    expect(plainText).toContain('1;30m');
    expect(plainText).toContain('1;37m');
    expect(plainText.match(/gYw/g)).toHaveLength(162);
  });

  it('keeps the first row label column aligned for long SGR labels', () => {
    const commandOutput = buildColorsPreviewCommand();
    const plainText = stripAnsi(commandOutput);

    expect(plainText).toContain(' 1;30m   gYw');
  });

  it('renders colored table cells with SGR resets', () => {
    const commandOutput = buildColorsPreviewCommand();

    expect(commandOutput).toContain('\x1b[1;30;40m');
    expect(commandOutput).toContain('\x1b[1;37;47m');
    expect(commandOutput).toContain('\r\n');
  });
});
