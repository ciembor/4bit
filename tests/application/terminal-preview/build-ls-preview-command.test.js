import { describe, expect, it } from 'vitest';
import {
  buildLsAllPreviewCommand,
  buildLsPreviewCommand,
} from '../../../src/application/terminal-preview/build-ls-preview-command';

function stripAnsi(value) {
  return value.replace(/\x1b\[[0-9;]*m/g, '');
}

function lineLengths(value) {
  return stripAnsi(value).split('\r\n').map((line) => line.length);
}

describe('buildLsPreviewCommand', () => {
  it('renders a compact ls preview with the same entries as ls -al', () => {
    const output = buildLsPreviewCommand();
    const plainText = stripAnsi(output);

    expect(plainText).toContain('about');
    expect(plainText).toContain('node_modules');
    expect(plainText).toContain('package-lock.json');
    expect(plainText).toContain('current -> dist');
    expect(plainText).toContain('public-assets -> dist/assets');
    expect(plainText).toContain('status.pipe');
    expect(plainText).not.toContain('drwxr-xr-x');
    expect(lineLengths(output).every((length) => length <= 80)).toBe(true);
  });

  it('renders a compact ls -al preview', () => {
    const output = buildLsAllPreviewCommand();
    const plainText = stripAnsi(output);

    expect(plainText).toContain('total 120');
    expect(plainText).toContain('drwxr-xr-x');
    expect(plainText).toContain('-rwxr-xr-x');
    expect(plainText).toContain('node_modules');
    expect(plainText).toContain('package-lock.json');
    expect(plainText).toContain('vite.config.js');
    expect(plainText).toContain('current -> dist');
    expect(plainText).toContain('public-assets -> dist/assets');
    expect(plainText).toContain('theme.tar.gz');
    expect(plainText).toContain('preview.sock');
    expect(plainText).toContain('status.pipe');
  });

  it('uses conventional dircolors-inspired SGR colors for file types', () => {
    const output = buildLsPreviewCommand();
    const allOutput = buildLsAllPreviewCommand();

    expect(output).toContain('\x1b[1;34msrc\x1b[0m');
    expect(output).toContain('\x1b[1;32mbuild.sh\x1b[0m');
    expect(output).toContain('\x1b[1;32mdeploy.sh\x1b[0m');
    expect(output).toContain('\x1b[1;36mcurrent\x1b[0m');
    expect(output).toContain('\x1b[1;36mpublic-assets\x1b[0m');
    expect(output).toContain('\x1b[1;31mtheme.tar.gz\x1b[0m');
    expect(output).toContain('\x1b[1;35mpreview.sock\x1b[0m');
    expect(output).toContain('\x1b[40;33;1mstatus.pipe\x1b[0m');
    expect(allOutput).toContain('\x1b[1;34msrc\x1b[0m');
    expect(allOutput).toContain('\x1b[1;32mbuild.sh\x1b[0m');
    expect(allOutput).toContain('\x1b[1;36mcurrent\x1b[0m');
  });
});
