import { watch } from 'vue';
import Color from 'color';
import { useSchemeStore } from '../stores/Scheme';
import { useCalculatedSchemeStore } from '../stores/CalculatedScheme';
import { ACHROMATIC_COLOR_NAMES } from '../constants';
import { CHROMATIC_COLOR_NAMES } from '../constants';

const LEGACY_SPECIAL_COLOR_NAME_MAP = {
  bright_black: 'brightBlack',
  bright_white: 'brightWhite',
};

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

class SchemeCalculator {
  constructor() {
    this.schemeStore = useSchemeStore();
    this.calculatedSchemeStore = useCalculatedSchemeStore();
    this.storeWatcher = null;

    this.observeStore();
  }

  calculateColors(scheme) {
    this.calculatedSchemeStore.calculatedScheme = calculateSchemeColors(scheme);
  }

  observeStore() {
    this.storeWatcher = watch(
      () => this.schemeStore.scheme,
      (newScheme) => {
        if (newScheme) {
          this.calculateColors(newScheme);
        }
      },
      { immediate: true, deep: true } 
    );
  }
}

export function calculateSchemeColors(scheme) {
  const {
    hue,
    saturation,
    normalChromaticLightness,
    brightChromaticLightness,
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

  const normalArray = degrees.map(degree =>
    Color({ h: normalizeHue(hue + degree), s: saturation, l: normalChromaticLightness })
  );
  const brightArray = degrees.map(degree =>
    Color({ h: normalizeHue(hue + degree), s: saturation, l: brightChromaticLightness })
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

export default SchemeCalculator;
