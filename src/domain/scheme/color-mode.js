export const COLOR_MODE_VALUES = Object.freeze([
  'monochrome',
  'duotone',
  'tricolor',
  'hexachrome',
]);
export const DEFAULT_COLOR_MODE = 'hexachrome';
export const DEFAULT_HUE_DISTANCE = 0;
export const HUE_DISTANCE_MIN = 0;
export const HUE_DISTANCE_MAX = 45;
export const STANDARD_COLOR_MODE_DEGREES = Object.freeze([0, 60, 120, 180, 240, 300]);
export const COLOR_MODE_HUE_CYCLES = Object.freeze({
  monochrome: 360,
  duotone: 180,
  tricolor: 120,
  hexachrome: 60,
});
const STANDARD_COLOR_MODE_HUE_DISTANCE_WEIGHTS = Object.freeze([0, 1, 0.5, -0.5, -1, -0.25]);
const COLOR_MODE_ALIASES = Object.freeze({
  uno: 'monochrome',
  duo: 'duotone',
  trio: 'tricolor',
  standard: 'hexachrome',
});

export function normalizeHueDegree(degree) {
  return ((degree % 360) + 360) % 360;
}

export function degreesEqual(first, second) {
  return (
    Array.isArray(first) &&
    Array.isArray(second) &&
    first.length === second.length &&
    first.every((degree, index) => degree === second[index])
  );
}

export function normalizeColorModeValue(value) {
  if (COLOR_MODE_VALUES.includes(value)) {
    return value;
  }

  return COLOR_MODE_ALIASES[value] || null;
}

export function isColorModeValue(value) {
  return normalizeColorModeValue(value) !== null;
}

export function clampHueDistance(distance) {
  const numericDistance = Number(distance);

  if (!Number.isFinite(numericDistance)) {
    return DEFAULT_HUE_DISTANCE;
  }

  return Math.min(HUE_DISTANCE_MAX, Math.max(HUE_DISTANCE_MIN, Math.round(numericDistance)));
}

export function colorModeHueCycle(mode) {
  const normalizedMode = normalizeColorModeValue(mode);

  return COLOR_MODE_HUE_CYCLES[normalizedMode] || 360;
}

export function normalizeHueForColorMode(hue, mode) {
  const numericHue = Number(hue);
  const cycle = colorModeHueCycle(mode);

  if (!Number.isFinite(numericHue)) {
    return 0;
  }

  const normalized = normalizeHueDegree(numericHue) % cycle;
  const halfCycle = cycle / 2;

  return normalized > halfCycle ? normalized - cycle : normalized;
}

function offsetStandardColorModeDegrees(distance) {
  return STANDARD_COLOR_MODE_DEGREES.map((degree, index) =>
    normalizeHueDegree(
      degree + Math.round(distance * STANDARD_COLOR_MODE_HUE_DISTANCE_WEIGHTS[index])
    )
  );
}

export function degreesForColorMode(mode, hueDistance = DEFAULT_HUE_DISTANCE) {
  const normalizedMode = normalizeColorModeValue(mode);
  const distance = clampHueDistance(hueDistance);

  switch (normalizedMode) {
    case 'monochrome':
      return [
        0,
        distance,
        Math.round(distance / 2),
        -Math.round(distance / 2),
        -distance,
        -Math.round(distance / 4),
      ].map(normalizeHueDegree);
    case 'duotone':
      return [0, distance, 180, 180 + distance, 180 - distance, -distance]
        .map(normalizeHueDegree);
    case 'tricolor':
      return [0, distance, 120, 120 + distance, 240, 240 + distance]
        .map(normalizeHueDegree);
    case 'hexachrome':
      return offsetStandardColorModeDegrees(distance);
    default:
      return null;
  }
}

export function inferColorModeFromDegrees(degrees, hueDistance = DEFAULT_HUE_DISTANCE) {
  return COLOR_MODE_VALUES.find((mode) =>
    degreesEqual(degrees, degreesForColorMode(mode, hueDistance))
  ) || null;
}
