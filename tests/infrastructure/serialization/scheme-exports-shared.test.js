import { describe, expect, it } from 'vitest';
import {
  normalColorName,
  paletteColorNames,
} from '../../../src/infrastructure/serialization/scheme-exports/shared';

describe('scheme-exports/shared', () => {
  it('keeps standard color names unchanged', () => {
    expect(normalColorName('red')).toBe('red');
    expect(normalColorName('brightBlue')).toBe('blue');
  });

  it('builds a palette with standard colors before bright colors', () => {
    expect(paletteColorNames().slice(0, 4)).toEqual(['black', 'red', 'green', 'yellow']);
    expect(paletteColorNames().slice(-4)).toEqual([
      'brightBlue',
      'brightMagenta',
      'brightCyan',
      'brightWhite',
    ]);
  });
});
