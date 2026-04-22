import { describe, expect, it } from 'vitest';
import Color from 'color';
import { calculateSchemeColors } from '../src/services/SchemeCalculator';

function createScheme(overrides = {}) {
  return {
    hue: -15,
    degrees: [0, 60, 120, 180, 240, 300],
    saturation: 50,
    normalChromaticLightness: 50,
    brightChromaticLightness: 75,
    normalBlackLightness: 0,
    brightBlackLightness: 12.5,
    normalWhiteLightness: 87.5,
    brightWhiteLightness: 100,
    dyeScope: 'none',
    dyeColor: {
      hue: 180,
      saturation: 50,
      lightness: 50,
      alpha: 0.25,
      ...overrides.dyeColor,
    },
    background: 'black',
    customBackgroundColor: {
      hue: 180,
      saturation: 50,
      lightness: 10,
      ...overrides.customBackgroundColor,
    },
    foreground: 'white',
    customForegroundColor: {
      hue: 180,
      saturation: 50,
      lightness: 90,
      ...overrides.customForegroundColor,
    },
    ...overrides,
  };
}

function colorHex(color) {
  return color.hex().toLowerCase();
}

describe('calculateSchemeColors', () => {
  it('normalizes wrapped hues into the expected palette', () => {
    const negativeHueColors = calculateSchemeColors(createScheme({ hue: -15 }));
    const wrappedHueColors = calculateSchemeColors(createScheme({ hue: 345 }));

    expect(colorHex(negativeHueColors.red)).toBe(colorHex(wrappedHueColors.red));
    expect(colorHex(negativeHueColors.red)).toBe(colorHex(Color({ h: 345, s: 50, l: 50 })));
    expect(colorHex(negativeHueColors.green)).toBe(colorHex(Color({ h: 105, s: 50, l: 50 })));
    expect(colorHex(negativeHueColors.brightBlue)).toBe(colorHex(Color({ h: 225, s: 50, l: 75 })));
    expect(colorHex(negativeHueColors.background)).toBe(colorHex(negativeHueColors.black));
    expect(colorHex(negativeHueColors.foreground)).toBe(colorHex(negativeHueColors.white));
  });

  it('tints only chromatic colors for the legacy color dye scope', () => {
    const result = calculateSchemeColors(createScheme({
      dyeScope: 'color',
      dyeColor: {
        hue: 180,
        saturation: 100,
        lightness: 50,
        alpha: 1,
      },
    }));

    const overlayColor = Color({ h: 180, s: 100, l: 50 });

    expect(colorHex(result.red)).toBe(colorHex(overlayColor));
    expect(colorHex(result.cyan)).toBe(colorHex(overlayColor));
    expect(colorHex(result.black)).toBe(colorHex(Color({ h: 0, s: 0, l: 0 })));
    expect(colorHex(result.white)).toBe(colorHex(Color({ h: 0, s: 0, l: 87.5 })));
  });

  it('tints achromatic colors when the dye scope is all', () => {
    const result = calculateSchemeColors(createScheme({
      dyeScope: 'all',
      dyeColor: {
        hue: 180,
        saturation: 100,
        lightness: 50,
        alpha: 1,
      },
    }));

    const overlayColor = Color({ h: 180, s: 100, l: 50 });

    expect(colorHex(result.black)).toBe(colorHex(overlayColor));
    expect(colorHex(result.brightWhite)).toBe(colorHex(overlayColor));
    expect(colorHex(result.background)).toBe(colorHex(overlayColor));
    expect(colorHex(result.foreground)).toBe(colorHex(overlayColor));
  });

  it('resolves legacy special color names and custom special colors', () => {
    const customForegroundColor = {
      hue: 210,
      saturation: 60,
      lightness: 70,
    };
    const result = calculateSchemeColors(createScheme({
      background: 'bright_black',
      foreground: 'custom',
      customForegroundColor,
    }));

    expect(colorHex(result.background)).toBe(colorHex(result.brightBlack));
    expect(colorHex(result.foreground)).toBe(colorHex(Color({
      h: customForegroundColor.hue,
      s: customForegroundColor.saturation,
      l: customForegroundColor.lightness,
    })));
  });
});
