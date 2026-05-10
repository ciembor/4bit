import {
  degreesForColorMode,
  inferColorModeFromDegrees,
  isColorModeValue,
  normalizeColorModeValue,
} from '../../../domain/scheme/color-mode';
import { sameValue } from './value-codec';

export function resolveSchemeColorMode(scheme) {
  if (isColorModeValue(scheme.colorMode)) {
    const presetDegrees = degreesForColorMode(scheme.colorMode, scheme.hueDistance);
    const normalizedColorMode = normalizeColorModeValue(scheme.colorMode);

    if (presetDegrees && sameValue(scheme.degrees, presetDegrees)) {
      return normalizedColorMode;
    }
  }

  return inferColorModeFromDegrees(scheme.degrees, scheme.hueDistance) || 'custom';
}

export function canonicalizeSchemeColorMode(scheme) {
  const inferredColorMode = inferColorModeFromDegrees(scheme.degrees, scheme.hueDistance);

  if (inferredColorMode) {
    scheme.colorMode = inferredColorMode;
    return;
  }

  scheme.colorMode = 'custom';
}
