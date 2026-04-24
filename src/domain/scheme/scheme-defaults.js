import {
  DEFAULT_COLOR_MODE,
  STANDARD_COLOR_MODE_DEGREES,
} from './color-mode';

export const SCHEME_DEFAULTS = Object.freeze({
  // chromatic
  hue: -15,
  colorMode: DEFAULT_COLOR_MODE,
  hueDistance: 0,
  degrees: STANDARD_COLOR_MODE_DEGREES,
  saturation: 50,
  saturationRange: 0,
  normalChromaticLightness: 50,
  brightChromaticLightness: 75,
  lightnessRange: 0,
  // achromatic
  normalBlackLightness: 0,
  brightBlackLightness: 12.5,
  normalWhiteLightness: 87.5,
  brightWhiteLightness: 100,
  // special
  dyeScope: 'none',
  dyeColor: Object.freeze({
    hue: 180,
    saturation: 50,
    lightness: 50,
    alpha: 0.25,
  }),
  background: 'black',
  customBackgroundColor: Object.freeze({
    hue: 180,
    saturation: 50,
    lightness: 10,
  }),
  foreground: 'white',
  customForegroundColor: Object.freeze({
    hue: 180,
    saturation: 50,
    lightness: 90,
  }),
});

export function cloneScheme(scheme = SCHEME_DEFAULTS) {
  return {
    ...scheme,
    degrees: [...scheme.degrees],
    dyeColor: { ...scheme.dyeColor },
    customBackgroundColor: { ...scheme.customBackgroundColor },
    customForegroundColor: { ...scheme.customForegroundColor },
  };
}

export function createDefaultScheme() {
  return cloneScheme(SCHEME_DEFAULTS);
}
