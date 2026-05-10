import { clampHueDistance } from '../../../domain/scheme/color-mode';
import { createDefaultScheme } from '../../../domain/scheme/scheme-defaults';
import {
  clampLightnessRange,
  clampSaturationRange,
} from '../../../domain/scheme/scheme-state';
import { canonicalizeSchemeColorMode } from './canonicalization';

function containsMissingValue(value) {
  return Array.isArray(value)
    ? value.some(containsMissingValue)
    : value === null || value === undefined;
}

export function hydrateSchemeSettings(values) {
  if (Object.values(values).some(containsMissingValue)) {
    return null;
  }

  const scheme = createDefaultScheme();
  scheme.hue = values.hue;
  scheme.colorMode = values.colorMode;
  scheme.hueDistance = clampHueDistance(values.hueDistance);
  scheme.degrees = values.degrees;
  scheme.saturation = values.saturation;
  scheme.saturationRange = clampSaturationRange(values.saturationRange);
  [
    scheme.normalChromaticLightness,
    scheme.brightChromaticLightness,
  ] = values.chromaticLightness;
  scheme.lightnessRange = clampLightnessRange(values.lightnessRange);
  [
    scheme.normalBlackLightness,
    scheme.brightBlackLightness,
  ] = values.blackLightness;
  [
    scheme.normalWhiteLightness,
    scheme.brightWhiteLightness,
  ] = values.whiteLightness;
  scheme.dyeScope = values.dyeScope;
  [
    scheme.dyeColor.hue,
    scheme.dyeColor.saturation,
    scheme.dyeColor.lightness,
    scheme.dyeColor.alpha,
  ] = values.dyeColor;
  scheme.background = values.background;
  [
    scheme.customBackgroundColor.hue,
    scheme.customBackgroundColor.saturation,
    scheme.customBackgroundColor.lightness,
  ] = values.customBackgroundColor;
  scheme.foreground = values.foreground;
  [
    scheme.customForegroundColor.hue,
    scheme.customForegroundColor.saturation,
    scheme.customForegroundColor.lightness,
  ] = values.customForegroundColor;

  canonicalizeSchemeColorMode(scheme);

  return scheme;
}
