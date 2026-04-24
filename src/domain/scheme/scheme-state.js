import {
  clampHueDistance,
  DEFAULT_HUE_DISTANCE,
  degreesForColorMode,
  normalizeHueForColorMode,
} from './color-mode';

export const DEFAULT_SATURATION_RANGE = 0;
export const SATURATION_RANGE_MIN = 0;
export const SATURATION_RANGE_MAX = 50;
export const DEFAULT_LIGHTNESS_RANGE = 0;
export const LIGHTNESS_RANGE_MIN = 0;
export const LIGHTNESS_RANGE_MAX = 30;

function clampRoundedNumber(value, min, max, fallback) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.round(numericValue)));
}

export function clampSaturationRange(range) {
  return clampRoundedNumber(
    range,
    SATURATION_RANGE_MIN,
    SATURATION_RANGE_MAX,
    DEFAULT_SATURATION_RANGE
  );
}

export function clampLightnessRange(range) {
  return clampRoundedNumber(
    range,
    LIGHTNESS_RANGE_MIN,
    LIGHTNESS_RANGE_MAX,
    DEFAULT_LIGHTNESS_RANGE
  );
}

export function normalizeSchemeRanges(scheme) {
  if (!scheme) {
    return scheme;
  }

  scheme.hueDistance = clampHueDistance(scheme.hueDistance ?? DEFAULT_HUE_DISTANCE);
  scheme.saturationRange = clampSaturationRange(scheme.saturationRange);
  scheme.lightnessRange = clampLightnessRange(scheme.lightnessRange);

  return scheme;
}

export function applyColorModeToScheme(scheme, mode) {
  if (!scheme) {
    return false;
  }

  const degrees = degreesForColorMode(mode, scheme.hueDistance);

  if (!degrees) {
    return false;
  }

  scheme.colorMode = mode;
  scheme.hue = normalizeHueForColorMode(scheme.hue, mode);
  scheme.degrees = [...degrees];

  return true;
}

export function applyHueDistanceToScheme(scheme, distance) {
  if (!scheme) {
    return DEFAULT_HUE_DISTANCE;
  }

  const nextDistance = clampHueDistance(distance);
  const degrees = degreesForColorMode(scheme.colorMode, nextDistance);

  scheme.hueDistance = nextDistance;

  if (degrees) {
    scheme.degrees = [...degrees];
  }

  return nextDistance;
}
