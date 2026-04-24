import Color from 'color';
import { ACHROMATIC_COLOR_NAMES, CHROMATIC_COLOR_NAMES } from './color-names';

const LEGACY_SPECIAL_COLOR_NAME_MAP = {
  bright_black: 'brightBlack',
  bright_white: 'brightWhite',
};

const CHROMATIC_VARIATION_WEIGHTS = [0, 1, 0.5, -0.5, -1, -0.25];

function clampPercentage(value) {
  return Math.min(100, Math.max(0, value));
}

function normalizeHue(hue) {
  return ((hue % 360) + 360) % 360;
}

function normalizeDyeScope(dyeScope) {
  if (dyeScope === 'color') {
    return 'chromatic';
  }

  return dyeScope;
}

function normalizeSpecialColorMode(mode) {
  return LEGACY_SPECIAL_COLOR_NAME_MAP[mode] || mode;
}

function createHslColor(color) {
  if (!color) {
    return null;
  }

  return Color({
    h: color.hue,
    s: color.saturation,
    l: color.lightness
  });
}

function createHslaColor(color) {
  if (!color) {
    return null;
  }

  return createHslColor(color).alpha(color.alpha);
}

function blendColors(overlayColor, baseColor, factor) {
  const overlay = overlayColor.rgb().array();
  const base = baseColor.rgb().array();
  const mixed = base.map((value, index) =>
    Math.round((overlay[index] * factor) + (value * (1 - factor)))
  );

  return Color.rgb(...mixed);
}

function colorNamesForDyeScope(dyeScope) {
  switch (normalizeDyeScope(dyeScope)) {
    case 'all':
      return [...ACHROMATIC_COLOR_NAMES, ...CHROMATIC_COLOR_NAMES];
    case 'achromatic':
      return ACHROMATIC_COLOR_NAMES;
    case 'chromatic':
      return CHROMATIC_COLOR_NAMES;
    default:
      return [];
  }
}

function resolveSpecialColor(mode, customColor, calculatedColors, fallbackColorName) {
  if (mode === 'custom') {
    return createHslColor(customColor) || calculatedColors[fallbackColorName];
  }

  return (
    calculatedColors[normalizeSpecialColorMode(mode)] ||
    calculatedColors[fallbackColorName]
  );
}

function rangeAdjustedPercentage(baseValue, rangeValue, index) {
  const numericRange = Number(rangeValue);
  const range = Number.isFinite(numericRange) ? numericRange : 0;
  const weight = CHROMATIC_VARIATION_WEIGHTS[index] || 0;

  return clampPercentage(baseValue + (range * weight));
}

export function calculateSchemeColors(scheme) {
  const {
    hue,
    saturation,
    saturationRange = 0,
    normalChromaticLightness,
    brightChromaticLightness,
    lightnessRange = 0,
    degrees,
    normalBlackLightness,
    brightBlackLightness,
    normalWhiteLightness,
    brightWhiteLightness,
    dyeScope,
    dyeColor,
    background,
    customBackgroundColor,
    foreground,
    customForegroundColor
  } = scheme;

  const normalArray = degrees.map((degree, index) =>
    Color({
      h: normalizeHue(hue + degree),
      s: rangeAdjustedPercentage(saturation, saturationRange, index),
      l: rangeAdjustedPercentage(normalChromaticLightness, lightnessRange, index)
    })
  );
  const brightArray = degrees.map((degree, index) =>
    Color({
      h: normalizeHue(hue + degree),
      s: rangeAdjustedPercentage(saturation, saturationRange, index),
      l: rangeAdjustedPercentage(brightChromaticLightness, lightnessRange, index)
    })
  );

  const calculatedColors = {
    black: Color({ h: 0, s: 0, l: normalBlackLightness }),
    brightBlack: Color({ h: 0, s: 0, l: brightBlackLightness }),
    white: Color({ h: 0, s: 0, l: normalWhiteLightness }),
    brightWhite: Color({ h: 0, s: 0, l: brightWhiteLightness }),
    red: normalArray[0],
    brightRed: brightArray[0],
    green: normalArray[2],
    brightGreen: brightArray[2],
    yellow: normalArray[1],
    brightYellow: brightArray[1],
    blue: normalArray[4],
    brightBlue: brightArray[4],
    magenta: normalArray[5],
    brightMagenta: brightArray[5],
    cyan: normalArray[3],
    brightCyan: brightArray[3]
  };

  const dyeNames = colorNamesForDyeScope(dyeScope);
  const overlayColor = createHslaColor(dyeColor);
  if (overlayColor && dyeNames.length > 0) {
    dyeNames.forEach((colorName) => {
      calculatedColors[colorName] = blendColors(
        overlayColor,
        calculatedColors[colorName],
        overlayColor.alpha()
      );
    });
  }

  return {
    ...calculatedColors,
    background: resolveSpecialColor(
      background,
      customBackgroundColor,
      calculatedColors,
      'black'
    ),
    foreground: resolveSpecialColor(
      foreground,
      customForegroundColor,
      calculatedColors,
      'white'
    ),
  };
}
