import { describe, expect, it } from 'vitest';
import { buildDiffPreviewCommand } from '../../../../src/application/terminal-preview/commands/build-diff-preview-command';

function stripAnsi(value) {
  return value.replace(/\x1b\[[0-9;]*m/g, '');
}

describe('buildDiffPreviewCommand', () => {
  it('renders a compact git diff preview', () => {
    const output = buildDiffPreviewCommand();
    const plainText = stripAnsi(output);

    expect(plainText).toContain('diff --git a/theme.css b/theme.css');
    expect(plainText).toContain('--- a/theme.css');
    expect(plainText).toContain('+++ b/theme.css');
    expect(plainText).toContain('-  color: #d7d7d7;');
    expect(plainText).toContain('+  color: #f0f0f0;');
    expect(plainText).toContain(' .terminal .prompt {');
    expect(plainText).toContain('-  color: #5fafd7;');
    expect(plainText).toContain('+  color: #55ffff;');
    expect(plainText).toContain(' .terminal .selection {');
    expect(plainText).toContain('-  background: #444444;');
    expect(plainText).toContain('+  background: #808080;');
  });

  it('uses red and green SGR colors for removed and added lines', () => {
    const output = buildDiffPreviewCommand();

    expect(output).toContain('\x1b[31m--- a/theme.css\x1b[0m');
    expect(output).toContain('\x1b[32m+++ b/theme.css\x1b[0m');
    expect(output).toContain('\x1b[31m-  color: #d7d7d7;\x1b[0m');
    expect(output).toContain('\x1b[32m+  color: #f0f0f0;\x1b[0m');
    expect(output).toContain('\x1b[31m-  color: #5fafd7;\x1b[0m');
    expect(output).toContain('\x1b[32m+  color: #55ffff;\x1b[0m');
    expect(output).toContain('\x1b[31m-  background: #444444;\x1b[0m');
    expect(output).toContain('\x1b[32m+  background: #808080;\x1b[0m');
  });
});
