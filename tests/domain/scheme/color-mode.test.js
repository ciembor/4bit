import { describe, expect, it } from 'vitest';
import {
  clampHueDistance,
  colorModeHueCycle,
  degreesEqual,
  degreesForColorMode,
  inferColorModeFromDegrees,
  isColorModeValue,
  normalizeColorModeValue,
  normalizeHueForColorMode,
} from '../../../src/domain/scheme/color-mode';

describe('ColorMode', () => {
  it('uses complementary families for duotone presets', () => {
    expect(degreesForColorMode('duotone', 20)).toEqual([0, 20, 180, 200, 160, 340]);
  });

  it('returns hue cycles that match each preset symmetry', () => {
    expect(colorModeHueCycle('monochrome')).toBe(360);
    expect(colorModeHueCycle('duotone')).toBe(180);
    expect(colorModeHueCycle('tricolor')).toBe(120);
    expect(colorModeHueCycle('hexachrome')).toBe(60);
    expect(colorModeHueCycle('custom')).toBe(360);
  });

  it('normalizes hues into the visible slider range for each preset', () => {
    expect(normalizeHueForColorMode(200, 'monochrome')).toBe(-160);
    expect(normalizeHueForColorMode(210, 'duotone')).toBe(30);
    expect(normalizeHueForColorMode(100, 'tricolor')).toBe(-20);
    expect(normalizeHueForColorMode(75, 'hexachrome')).toBe(15);
  });

  it('accepts aliases and validates known color modes', () => {
    expect(normalizeColorModeValue('duo')).toBe('duotone');
    expect(normalizeColorModeValue('standard')).toBe('hexachrome');
    expect(normalizeColorModeValue('unknown')).toBeNull();

    expect(isColorModeValue('trio')).toBe(true);
    expect(isColorModeValue('custom')).toBe(false);
  });

  it('clamps hue distance to the supported integer range', () => {
    expect(clampHueDistance(20.4)).toBe(20);
    expect(clampHueDistance(999)).toBe(45);
    expect(clampHueDistance(-1)).toBe(0);
    expect(clampHueDistance('oops')).toBe(0);
  });

  it('compares and infers color modes from degree sets', () => {
    const duotoneDegrees = degreesForColorMode('duotone', 20);

    expect(degreesEqual(duotoneDegrees, [0, 20, 180, 200, 160, 340])).toBe(true);
    expect(degreesEqual(duotoneDegrees, [0, 20, 180])).toBe(false);
    expect(degreesEqual(null, duotoneDegrees)).toBe(false);

    expect(inferColorModeFromDegrees(duotoneDegrees, 20)).toBe('duotone');
    expect(inferColorModeFromDegrees([1, 2, 3, 4, 5, 6], 20)).toBeNull();
  });
});
