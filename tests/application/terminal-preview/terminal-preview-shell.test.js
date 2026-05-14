import { describe, expect, it } from 'vitest';
import Color from 'color';
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

    expect(stripAnsi(helpOutput)).toContain('Tools:');
    expect(stripAnsi(helpOutput)).toContain('Examples:');
    expect(stripAnsi(helpOutput)).toContain('clear      Clear the terminal screen.');
    expect(stripAnsi(helpOutput)).toContain('colors     Show the ANSI color matrix.');
    expect(stripAnsi(helpOutput)).toContain('usability  Check WCAG-based text contrast.');
    expect(stripAnsi(helpOutput)).toContain('git diff   Show a colored git diff sample.');
    expect(stripAnsi(helpOutput)).toContain('git status Show a colored git status sample.');
    expect(stripAnsi(helpOutput)).toContain('ls         Show a compact directory listing.');
    expect(stripAnsi(helpOutput)).toContain('ls -al     Show a detailed directory listing.');
    expect(helpOutput).toContain('\x1b[35musability\x1b[0m');
    expect(helpOutput).toContain('\x1b[36mgit diff\x1b[0m');
    expect(helpOutput).not.toContain('\x1b[35mwcag\x1b[0m');
    expect(unknownOutput).toContain('zsh: command not found: wat');
    expect(stripAnsi(unknownOutput)).toContain('Tools:');
    expect(stripAnsi(unknownOutput)).toContain('Examples:');
    expect(stripAnsi(unknownOutput)).toContain('usability');
    expect(stripAnsi(unknownOutput)).not.toContain('wcag');
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

  it('runs the dynamic usability preview command with live color context', () => {
    const output = runTerminalPreviewCommand('usability', {
      colors: {
        background: Color('#000000'),
        foreground: Color('#ffffff'),
        black: Color('#000000'),
        red: Color('#cc0000'),
        green: Color('#00cc00'),
        yellow: Color('#cccc00'),
        blue: Color('#0000cc'),
        magenta: Color('#cc00cc'),
        cyan: Color('#00cccc'),
        white: Color('#cccccc'),
        brightBlack: Color('#808080'),
        brightWhite: Color('#ffffff'),
      },
    });

    expect(output.type).toBe('dynamic');
    expect(stripAnsi(output.content)).toContain('Checks if terminal text colors stay readable');
    expect(stripAnsi(output.content)).toContain('foreground');
  });

  it('keeps the WCAG command as an alias', () => {
    expect(runTerminalPreviewCommand('wcag', { colors: {} }).type).toBe('dynamic');
  });
});
