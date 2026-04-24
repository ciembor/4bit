import { describe, expect, it } from 'vitest';
import Color from 'color';
import { calculateSchemeColors } from '../../../src/domain/scheme/color-scheme-calculator';

function createScheme(overrides = {}) {
  return {
    hue: -15,
    degrees: [0, 60, 120, 180, 240, 300],
    saturation: 50,
    saturationRange: 0,
    normalChromaticLightness: 50,
    brightChromaticLightness: 75,
    lightnessRange: 0,
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

  it('uses custom hue-set degree offsets for chromatic color slots', () => {
    const colors = calculateSchemeColors(createScheme({
      hue: 100,
      degrees: [0, 10, 20, 30, 40, 50],
    }));

    expect(colorHex(colors.red)).toBe(colorHex(Color({ h: 100, s: 50, l: 50 })));
    expect(colorHex(colors.yellow)).toBe(colorHex(Color({ h: 110, s: 50, l: 50 })));
    expect(colorHex(colors.green)).toBe(colorHex(Color({ h: 120, s: 50, l: 50 })));
    expect(colorHex(colors.cyan)).toBe(colorHex(Color({ h: 130, s: 50, l: 50 })));
    expect(colorHex(colors.blue)).toBe(colorHex(Color({ h: 140, s: 50, l: 50 })));
    expect(colorHex(colors.magenta)).toBe(colorHex(Color({ h: 150, s: 50, l: 50 })));
  });

  it('keeps monochrome hue-distance variants inside one hue family', () => {
    const colors = calculateSchemeColors(createScheme({
      hue: 0,
      degrees: [0, 20, 10, 350, 340, 355],
    }));

    expect(colorHex(colors.red)).toBe(colorHex(Color({ h: 0, s: 50, l: 50 })));
    expect(colorHex(colors.yellow)).toBe(colorHex(Color({ h: 20, s: 50, l: 50 })));
    expect(colorHex(colors.green)).toBe(colorHex(Color({ h: 10, s: 50, l: 50 })));
    expect(colorHex(colors.cyan)).toBe(colorHex(Color({ h: 350, s: 50, l: 50 })));
    expect(colorHex(colors.blue)).toBe(colorHex(Color({ h: 340, s: 50, l: 50 })));
    expect(colorHex(colors.magenta)).toBe(colorHex(Color({ h: 355, s: 50, l: 50 })));
    expect(colorHex(colors.yellow)).not.toBe(colorHex(colors.red));
    expect(colorHex(colors.blue)).not.toBe(colorHex(colors.red));
  });

  it('keeps duotone hue-distance variants inside complementary hue families', () => {
    const colors = calculateSchemeColors(createScheme({
      hue: 0,
      degrees: [0, 20, 180, 200, 160, 340],
    }));

    expect(colorHex(colors.red)).toBe(colorHex(Color({ h: 0, s: 50, l: 50 })));
    expect(colorHex(colors.yellow)).toBe(colorHex(Color({ h: 20, s: 50, l: 50 })));
    expect(colorHex(colors.green)).toBe(colorHex(Color({ h: 180, s: 50, l: 50 })));
    expect(colorHex(colors.cyan)).toBe(colorHex(Color({ h: 200, s: 50, l: 50 })));
    expect(colorHex(colors.blue)).toBe(colorHex(Color({ h: 160, s: 50, l: 50 })));
    expect(colorHex(colors.magenta)).toBe(colorHex(Color({ h: 340, s: 50, l: 50 })));
    expect(colorHex(colors.red)).not.toBe(colorHex(colors.green));
    expect(colorHex(colors.yellow)).not.toBe(colorHex(colors.red));
    expect(colorHex(colors.cyan)).not.toBe(colorHex(colors.green));
  });

  it('keeps the classic hexachrome palette when all advanced distances are neutral', () => {
    const legacyColors = calculateSchemeColors(createScheme({
      hue: 0,
      degrees: [0, 60, 120, 180, 240, 300],
      saturationRange: 0,
      lightnessRange: 0,
    }));

    expect(colorHex(legacyColors.red)).toBe(colorHex(Color({ h: 0, s: 50, l: 50 })));
    expect(colorHex(legacyColors.yellow)).toBe(colorHex(Color({ h: 60, s: 50, l: 50 })));
    expect(colorHex(legacyColors.green)).toBe(colorHex(Color({ h: 120, s: 50, l: 50 })));
    expect(colorHex(legacyColors.cyan)).toBe(colorHex(Color({ h: 180, s: 50, l: 50 })));
    expect(colorHex(legacyColors.blue)).toBe(colorHex(Color({ h: 240, s: 50, l: 50 })));
    expect(colorHex(legacyColors.magenta)).toBe(colorHex(Color({ h: 300, s: 50, l: 50 })));
  });

  it('supports offsetting the hexachrome hue-set while keeping six distinct slots', () => {
    const colors = calculateSchemeColors(createScheme({
      hue: 0,
      degrees: [0, 80, 130, 170, 220, 295],
    }));

    expect(colorHex(colors.red)).toBe(colorHex(Color({ h: 0, s: 50, l: 50 })));
    expect(colorHex(colors.yellow)).toBe(colorHex(Color({ h: 80, s: 50, l: 50 })));
    expect(colorHex(colors.green)).toBe(colorHex(Color({ h: 130, s: 50, l: 50 })));
    expect(colorHex(colors.cyan)).toBe(colorHex(Color({ h: 170, s: 50, l: 50 })));
    expect(colorHex(colors.blue)).toBe(colorHex(Color({ h: 220, s: 50, l: 50 })));
    expect(colorHex(colors.magenta)).toBe(colorHex(Color({ h: 295, s: 50, l: 50 })));
    expect(new Set([
      colorHex(colors.red),
      colorHex(colors.yellow),
      colorHex(colors.green),
      colorHex(colors.cyan),
      colorHex(colors.blue),
      colorHex(colors.magenta),
    ]).size).toBe(6);
  });

  it('applies saturation and lightness ranges across chromatic slots', () => {
    const colors = calculateSchemeColors(createScheme({
      hue: 0,
      saturation: 50,
      saturationRange: 20,
      normalChromaticLightness: 50,
      brightChromaticLightness: 75,
      lightnessRange: 10,
    }));

    expect(colorHex(colors.red)).toBe(colorHex(Color({ h: 0, s: 50, l: 50 })));
    expect(colorHex(colors.yellow)).toBe(colorHex(Color({ h: 60, s: 70, l: 60 })));
    expect(colorHex(colors.green)).toBe(colorHex(Color({ h: 120, s: 60, l: 55 })));
    expect(colorHex(colors.cyan)).toBe(colorHex(Color({ h: 180, s: 40, l: 45 })));
    expect(colorHex(colors.blue)).toBe(colorHex(Color({ h: 240, s: 30, l: 40 })));
    expect(colorHex(colors.magenta)).toBe(colorHex(Color({ h: 300, s: 45, l: 47.5 })));
    expect(colorHex(colors.brightYellow)).toBe(colorHex(Color({ h: 60, s: 70, l: 85 })));
    expect(colorHex(colors.brightBlue)).toBe(colorHex(Color({ h: 240, s: 30, l: 65 })));
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

  it('tints only achromatic colors when the dye scope is achromatic', () => {
    const result = calculateSchemeColors(createScheme({
      dyeScope: 'achromatic',
      dyeColor: {
        hue: 180,
        saturation: 100,
        lightness: 50,
        alpha: 1,
      },
    }));

    const overlayColor = Color({ h: 180, s: 100, l: 50 });

    expect(colorHex(result.black)).toBe(colorHex(overlayColor));
    expect(colorHex(result.white)).toBe(colorHex(overlayColor));
    expect(colorHex(result.red)).toBe(colorHex(Color({ h: 345, s: 50, l: 50 })));
    expect(colorHex(result.cyan)).toBe(colorHex(Color({ h: 165, s: 50, l: 50 })));
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

  it('falls back to black and white when custom or unknown special colors cannot be resolved', () => {
    const result = calculateSchemeColors(createScheme({
      dyeColor: null,
      background: 'custom',
      customBackgroundColor: null,
      foreground: 'unknown',
      customForegroundColor: null,
    }));

    expect(colorHex(result.background)).toBe(colorHex(result.black));
    expect(colorHex(result.foreground)).toBe(colorHex(result.white));
  });

  it('treats invalid saturation and lightness ranges as zero adjustments', () => {
    const baseline = calculateSchemeColors(createScheme({
      saturationRange: 0,
      lightnessRange: 0,
    }));
    const invalidRanges = calculateSchemeColors(createScheme({
      saturationRange: 'oops',
      lightnessRange: Number.POSITIVE_INFINITY,
    }));

    expect(colorHex(invalidRanges.yellow)).toBe(colorHex(baseline.yellow));
    expect(colorHex(invalidRanges.brightBlue)).toBe(colorHex(baseline.brightBlue));
  });
});
