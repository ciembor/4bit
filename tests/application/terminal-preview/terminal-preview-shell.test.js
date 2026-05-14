import { describe, expect, it } from 'vitest';
import {
  renderTerminalPreviewHelpLine,
  renderTerminalPreviewPrompt,
  TERMINAL_PREVIEW_CLEAR_COMMAND,
  runTerminalPreviewCommand,
} from '../../../src/application/terminal-preview/terminal-preview-shell';

function stripAnsi(value) {
  return value.replace(/\x1b\[[0-9;]*m/g, '');
}

describe('terminal-preview-shell', () => {
  it('renders the shell prompt and help line', () => {
    expect(stripAnsi(renderTerminalPreviewHelpLine())).toBe('Type help to see available commands.');
    expect(stripAnsi(renderTerminalPreviewPrompt())).toBe('ciembor@browser ~> ');
    expect(stripAnsi(renderTerminalPreviewPrompt({ command: 'colors' }))).toBe('ciembor@browser ~> colors');
  });

  it('runs the colors preview command', () => {
    const output = runTerminalPreviewCommand('colors');

    expect(stripAnsi(output)).toContain('40m');
    expect(stripAnsi(output).match(/gYw/g)).toHaveLength(162);
  });

  it('runs the initial colors command for the boot transcript', () => {
    const output = runTerminalPreviewCommand('colors');

    expect(stripAnsi(output)).toContain('1;37m');
  });

  it('renders help and unknown command output', () => {
    const helpOutput = runTerminalPreviewCommand('help');
    const unknownOutput = runTerminalPreviewCommand('wat');

    expect(helpOutput).toContain('Available commands:');
    expect(helpOutput).toContain('clear');
    expect(helpOutput).toContain('git diff');
    expect(helpOutput).toContain('git status');
    expect(helpOutput).toContain('ls');
    expect(helpOutput).toContain('ls -al');
    expect(unknownOutput).toContain('zsh: command not found: wat');
    expect(unknownOutput).toContain('Available commands:');
    expect(unknownOutput).toContain('clear');
    expect(unknownOutput).toContain('colors');
    expect(unknownOutput).toContain('git diff');
    expect(unknownOutput).toContain('git status');
    expect(unknownOutput).toContain('ls');
    expect(unknownOutput).toContain('ls -al');
    expect(runTerminalPreviewCommand('   ')).toBe('');
  });

  it('runs the clear control command', () => {
    expect(runTerminalPreviewCommand('clear')).toBe(TERMINAL_PREVIEW_CLEAR_COMMAND);
  });

  it('runs the git diff preview command', () => {
    const output = runTerminalPreviewCommand('git diff');

    expect(stripAnsi(output)).toContain('diff --git a/theme.css b/theme.css');
    expect(output).toContain('\x1b[31m-  color: #d7d7d7;\x1b[0m');
    expect(output).toContain('\x1b[32m+  color: #f0f0f0;\x1b[0m');
  });

  it('runs the ls preview command', () => {
    const output = runTerminalPreviewCommand('ls');

    expect(stripAnsi(output)).toContain('README.md');
    expect(stripAnsi(output)).toContain('current -> dist');
    expect(stripAnsi(output)).not.toContain('drwxr-xr-x');
    expect(output).toContain('\x1b[1;34msrc\x1b[0m');
    expect(output).toContain('\x1b[1;32mbuild.sh\x1b[0m');
    expect(output).toContain('\x1b[1;36mcurrent\x1b[0m');
  });

  it('runs the ls -al preview command', () => {
    const output = runTerminalPreviewCommand('ls -al');

    expect(stripAnsi(output)).toContain('drwxr-xr-x');
    expect(stripAnsi(output)).toContain('current -> dist');
    expect(output).toContain('\x1b[1;34msrc\x1b[0m');
  });

  it('runs the git status preview command', () => {
    const output = runTerminalPreviewCommand('git status');

    expect(stripAnsi(output)).toContain('On branch master');
    expect(stripAnsi(output)).toContain('Changes to be committed:');
    expect(output).toContain('\x1b[32m1 commit\x1b[0m');
    expect(output).toContain('\x1b[31mdeleted:    TODO.md\x1b[0m');
  });
});
