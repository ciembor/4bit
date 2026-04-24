import { describe, expect, it } from 'vitest';
import {
  DEFAULT_HUE_DISTANCE,
  degreesForColorMode,
} from '../../../src/domain/scheme/color-mode';
import { createDefaultScheme } from '../../../src/domain/scheme/scheme-defaults';
import {
  applyColorModeToScheme,
  applyHueDistanceToScheme,
  clampLightnessRange,
  clampSaturationRange,
  DEFAULT_LIGHTNESS_RANGE,
  DEFAULT_SATURATION_RANGE,
  normalizeSchemeRanges,
} from '../../../src/domain/scheme/scheme-state';

describe('scheme-state', () => {
  it('clamps advanced range values to domain limits', () => {
    expect(clampSaturationRange(999)).toBe(50);
    expect(clampSaturationRange(-10)).toBe(0);
    expect(clampSaturationRange('oops')).toBe(DEFAULT_SATURATION_RANGE);

    expect(clampLightnessRange(999)).toBe(30);
    expect(clampLightnessRange(-10)).toBe(0);
    expect(clampLightnessRange(null)).toBe(DEFAULT_LIGHTNESS_RANGE);
  });

  it('normalizes scheme ranges in place', () => {
    const scheme = createDefaultScheme();

    scheme.hueDistance = 999;
    scheme.saturationRange = 999;
    scheme.lightnessRange = 999;

    expect(normalizeSchemeRanges(scheme)).toBe(scheme);
    expect(scheme.hueDistance).toBe(45);
    expect(scheme.saturationRange).toBe(50);
    expect(scheme.lightnessRange).toBe(30);
  });

  it('returns the incoming nullish scheme unchanged when normalizing ranges', () => {
    expect(normalizeSchemeRanges(null)).toBeNull();
    expect(normalizeSchemeRanges(undefined)).toBeUndefined();
  });

  it('applies preset color mode invariants to the scheme', () => {
    const scheme = createDefaultScheme();

    scheme.hue = 210;
    scheme.hueDistance = 18;

    expect(applyColorModeToScheme(scheme, 'duotone')).toBe(true);
    expect(scheme.colorMode).toBe('duotone');
    expect(scheme.hue).toBe(30);
    expect(scheme.degrees).toEqual(degreesForColorMode('duotone', 18));
  });

  it('leaves the scheme unchanged for unsupported color modes', () => {
    const scheme = createDefaultScheme();
    const original = {
      colorMode: scheme.colorMode,
      hue: scheme.hue,
      degrees: [...scheme.degrees],
    };

    expect(applyColorModeToScheme(scheme, 'custom')).toBe(false);
    expect(scheme.colorMode).toBe(original.colorMode);
    expect(scheme.hue).toBe(original.hue);
    expect(scheme.degrees).toEqual(original.degrees);
  });

  it('updates hue distance and recalculates preset degrees', () => {
    const scheme = createDefaultScheme();

    scheme.colorMode = 'tricolor';

    expect(applyHueDistanceToScheme(scheme, 15)).toBe(15);
    expect(scheme.hueDistance).toBe(15);
    expect(scheme.degrees).toEqual(degreesForColorMode('tricolor', 15));
  });

  it('updates hue distance without changing custom degrees', () => {
    const scheme = createDefaultScheme();

    scheme.colorMode = 'custom';
    scheme.degrees = [1, 2, 3, 4, 5, 6];

    expect(applyHueDistanceToScheme(scheme, 999)).toBe(45);
    expect(scheme.hueDistance).toBe(45);
    expect(scheme.degrees).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('returns the default hue distance for a nullish scheme', () => {
    expect(applyHueDistanceToScheme(null, 10)).toBe(DEFAULT_HUE_DISTANCE);
    expect(applyHueDistanceToScheme(undefined, 10)).toBe(DEFAULT_HUE_DISTANCE);
  });
});
