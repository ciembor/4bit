import {
  clampHueDistance,
  degreesForColorMode,
  normalizeColorModeValue,
} from '../../../domain/scheme/color-mode';
import { createDefaultScheme } from '../../../domain/scheme/scheme-defaults';
import {
  clampLightnessRange,
  clampSaturationRange,
} from '../../../domain/scheme/scheme-state';
import {
  DYE_SCOPE_VALUES,
  parseNumber,
  parseNumberList,
  SPECIAL_COLOR_VALUES,
} from './value-codec';
import { SCHEME_DEGREE_COUNT } from './schema';
import { canonicalizeSchemeColorMode } from './canonicalization';

export const LEGACY_SCHEME_QUERY_KEYS = Object.freeze([
  'hue',
  'colorMode',
  'hueSet',
  'hueDistance',
  'degrees',
  'saturation',
  'saturationRange',
  'chromaticLightness',
  'lightnessRange',
  'blackLightness',
  'whiteLightness',
  'dyeScope',
  'dyeColor',
  'background',
  'customBackgroundColor',
  'foreground',
  'customForegroundColor',
]);

function applyPresetDegreesIfMissing(scheme, hasDegreesParam) {
  if (hasDegreesParam) {
    return;
  }

  scheme.degrees = degreesForColorMode(scheme.colorMode, scheme.hueDistance);
}

export function readLegacySchemeUrlSettings(params) {
  const scheme = createDefaultScheme();

  const parsedHue = parseNumber(params.get('hue'));
  if (parsedHue !== null) {
    scheme.hue = parsedHue;
  }

  const colorMode = params.get('colorMode') || params.get('hueSet');
  const normalizedColorMode = normalizeColorModeValue(colorMode);
  if (normalizedColorMode) {
    scheme.colorMode = normalizedColorMode;
  }

  if (params.has('hueDistance')) {
    scheme.hueDistance = clampHueDistance(params.get('hueDistance'));
  }

  const degrees = parseNumberList(params.get('degrees'), SCHEME_DEGREE_COUNT);
  const hasDegreesParam = params.has('degrees') && degrees !== null;
  if (degrees) {
    scheme.degrees = degrees;
  }

  const parsedSaturation = parseNumber(params.get('saturation'));
  if (parsedSaturation !== null) {
    scheme.saturation = parsedSaturation;
  }

  const parsedSaturationRange = parseNumber(params.get('saturationRange'));
  if (parsedSaturationRange !== null) {
    scheme.saturationRange = clampSaturationRange(parsedSaturationRange);
  }

  const chromaticLightness = parseNumberList(params.get('chromaticLightness'), 2);
  if (chromaticLightness) {
    [scheme.normalChromaticLightness, scheme.brightChromaticLightness] = chromaticLightness;
  }

  const parsedLightnessRange = parseNumber(params.get('lightnessRange'));
  if (parsedLightnessRange !== null) {
    scheme.lightnessRange = clampLightnessRange(parsedLightnessRange);
  }

  const blackLightness = parseNumberList(params.get('blackLightness'), 2);
  if (blackLightness) {
    [scheme.normalBlackLightness, scheme.brightBlackLightness] = blackLightness;
  }

  const whiteLightness = parseNumberList(params.get('whiteLightness'), 2);
  if (whiteLightness) {
    [scheme.normalWhiteLightness, scheme.brightWhiteLightness] = whiteLightness;
  }

  const dyeScope = params.get('dyeScope');
  if (DYE_SCOPE_VALUES.includes(dyeScope)) {
    scheme.dyeScope = dyeScope;
  }

  const dyeColor = parseNumberList(params.get('dyeColor'), 4);
  if (dyeColor) {
    [
      scheme.dyeColor.hue,
      scheme.dyeColor.saturation,
      scheme.dyeColor.lightness,
      scheme.dyeColor.alpha,
    ] = dyeColor;
  }

  const background = params.get('background');
  if (SPECIAL_COLOR_VALUES.includes(background)) {
    scheme.background = background;
  }

  const customBackgroundColor = parseNumberList(params.get('customBackgroundColor'), 3);
  if (customBackgroundColor) {
    [
      scheme.customBackgroundColor.hue,
      scheme.customBackgroundColor.saturation,
      scheme.customBackgroundColor.lightness,
    ] = customBackgroundColor;
  }

  const foreground = params.get('foreground');
  if (SPECIAL_COLOR_VALUES.includes(foreground)) {
    scheme.foreground = foreground;
  }

  const customForegroundColor = parseNumberList(params.get('customForegroundColor'), 3);
  if (customForegroundColor) {
    [
      scheme.customForegroundColor.hue,
      scheme.customForegroundColor.saturation,
      scheme.customForegroundColor.lightness,
    ] = customForegroundColor;
  }

  applyPresetDegreesIfMissing(scheme, hasDegreesParam);
  canonicalizeSchemeColorMode(scheme);

  return scheme;
}
