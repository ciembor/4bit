import { describe, expect, it } from 'vitest';
import { buildGitStatusPreviewCommand } from '../../../src/application/terminal-preview/build-git-status-preview-command';

function stripAnsi(value) {
  return value.replace(/\x1b\[[0-9;]*m/g, '');
}

describe('buildGitStatusPreviewCommand', () => {
  it('renders a compact git status preview', () => {
    const output = buildGitStatusPreviewCommand();
    const plainText = stripAnsi(output);

    expect(plainText).toContain('On branch master');
    expect(plainText).toContain('Changes to be committed:');
    expect(plainText).toContain('Changes not staged for commit:');
    expect(plainText).toContain('Untracked files:');
    expect(plainText).toContain('new file:   src/application/terminal-preview/build-git-status-preview-command.js');
  });

  it('uses conventional git status colors', () => {
    const output = buildGitStatusPreviewCommand();

    expect(output).toContain('\x1b[36mmaster\x1b[0m');
    expect(output).toContain('\x1b[32m1 commit\x1b[0m');
    expect(output).toContain('\x1b[32mmodified:   src/application/terminal-preview/build-terminal-preview-sequence.js\x1b[0m');
    expect(output).toContain('\x1b[31mmodified:   src/presentation/editor-page/terminal-preview/xterm-terminal-preview.js\x1b[0m');
    expect(output).toContain('\x1b[31mtests/application/terminal-preview/build-git-status-preview-command.test.js\x1b[0m');
  });
});
