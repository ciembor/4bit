import Color from 'color';
import { describe, expect, it } from 'vitest';
import {
  buildUsabilityPreviewCommand,
  contrastRatio,
} from '../../../../src/application/terminal-preview/commands/build-usability-preview-command';

function stripAnsi(value) {
  return value.replace(/\x1b\[[0-9;]*m/g, '');
}

function colors(overrides = {}) {
  return {
    background: Color('#101010'),
    foreground: Color('#f0f0f0'),
    black: Color('#000000'),
    red: Color('#cc0000'),
    green: Color('#00aa00'),
    yellow: Color('#cccc00'),
    blue: Color('#0000aa'),
    magenta: Color('#cc00cc'),
    cyan: Color('#00cccc'),
    white: Color('#cccccc'),
    brightBlack: Color('#808080'),
    brightRed: Color('#ff5555'),
    brightGreen: Color('#55ff55'),
    brightYellow: Color('#ffff55'),
    brightBlue: Color('#5555ff'),
    brightMagenta: Color('#ff55ff'),
    brightCyan: Color('#55ffff'),
    brightWhite: Color('#ffffff'),
    ...overrides,
  };
}

describe('buildUsabilityPreviewCommand', () => {
  it('calculates WCAG contrast ratios', () => {
    expect(contrastRatio(Color('#ffffff'), Color('#000000'))).toBeCloseTo(21, 1);
    expect(contrastRatio(Color('#777777'), Color('#777777'))).toBeCloseTo(1, 1);
  });

  it('renders a one-screen usability report for the current scheme', () => {
    const output = buildUsabilityPreviewCommand(colors());
    const plainText = stripAnsi(output);

    expect(plainText).not.toContain('Terminal usability');
    expect(plainText).toContain('Checks if terminal text colors stay readable on the background.');
    expect(plainText).toContain('Uses WCAG 2.x contrast: PASS >= 4.5:1, WARN >= 3.0:1, FAIL < 3.0:1.');
    expect(output).toContain('Uses \x1b[1mWCAG\x1b[0m 2.x contrast');
    expect(output).toContain('\x1b[32mPASS\x1b[0m >= 4.5:1');
    expect(output).toContain('\x1b[33mWARN\x1b[0m >= 3.0:1');
    expect(output).toContain('\x1b[31mFAIL\x1b[0m < 3.0:1');
    expect(plainText).toContain('foreground');
    expect(plainText).toContain('bright red');
    expect(plainText).toContain('bright cyan');
    expect(plainText).not.toContain('red-green');
    expect(plainText).not.toContain('selection');
    expect(plainText).not.toContain('cursor');
    expect(plainText).not.toContain('verdict:');
    expect(plainText.split('\r\n').length).toBeLessThanOrEqual(24);
    expect(Math.max(...plainText.split('\r\n').map((line) => line.length))).toBeLessThanOrEqual(80);
  });

  it('aligns bright colors with their matching normal colors', () => {
    const output = stripAnsi(buildUsabilityPreviewCommand(colors()));

    expect(output).toContain('| black');
    expect(output).toContain('| bright black');
    expect(output).toContain('| red');
    expect(output).toContain('| bright red');
    expect(output).toContain('| green');
    expect(output).toContain('| bright green');
  });

  it('renders color names with their terminal colors', () => {
    const output = buildUsabilityPreviewCommand(colors());

    expect(output).toContain('\x1b[31mred\x1b[0m');
    expect(output).toContain('\x1b[32mgreen\x1b[0m');
    expect(output).toContain('\x1b[34mblue\x1b[0m');
    expect(output).toContain('\x1b[91mbright red\x1b[0m');
    expect(output).toContain('\x1b[97mbright white\x1b[0m');
  });

  it('changes report values when the scheme changes', () => {
    const readableOutput = stripAnsi(buildUsabilityPreviewCommand(colors()));
    const lowContrastOutput = stripAnsi(buildUsabilityPreviewCommand(colors({
      foreground: Color('#111111'),
    })));

    expect(readableOutput).not.toBe(lowContrastOutput);
    expect(lowContrastOutput).toContain('foreground');
    expect(lowContrastOutput).toContain('FAIL');
  });
});
