export const DYE_SCOPE_VALUES = Object.freeze(['none', 'all', 'achromatic', 'color']);
export const SPECIAL_COLOR_VALUES = Object.freeze(['custom', 'black', 'bright_black', 'white', 'bright_white']);

const LIGHTNESS_STEP = 25 / 64;
const QUANTIZE_EPSILON = 1e-9;

export function parseNumber(value) {
  if (value === null || value === '') {
    return null;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

export function parseNumberList(value, expectedLength) {
  const entries = String(value)
    .split(',')
    .map((entry) => parseNumber(entry));

  return entries.length === expectedLength && entries.every((entry) => entry !== null)
    ? entries
    : null;
}

export function sameValue(first, second) {
  if (Array.isArray(first) && Array.isArray(second)) {
    return (
      first.length === second.length &&
      first.every((entry, index) => entry === second[index])
    );
  }

  return first === second;
}

function serializeRoundedNumber(value, maxDecimals) {
  return String(Number(value.toFixed(maxDecimals)));
}

function serializeQuantizedNumber(value, { step, maxDecimals }) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return String(value);
  }

  const quantizedValue = Math.round(numericValue / step) * step;

  if (Math.abs(numericValue - quantizedValue) <= QUANTIZE_EPSILON) {
    return serializeRoundedNumber(quantizedValue, maxDecimals);
  }

  return String(numericValue);
}

function serializeIntegerLike(value) {
  return serializeQuantizedNumber(value, { step: 1, maxDecimals: 0 });
}

function serializePickerNumber(value) {
  return serializeQuantizedNumber(value, { step: 0.01, maxDecimals: 2 });
}

function serializeLightnessValue(value) {
  return serializeQuantizedNumber(value, { step: LIGHTNESS_STEP, maxDecimals: 6 });
}

export function serializeSchemeSettingValue(key, value) {
  switch (key) {
    case 'hue':
    case 'hueDistance':
    case 'degrees':
    case 'saturation':
    case 'saturationRange':
    case 'lightnessRange':
      return Array.isArray(value)
        ? value.map(serializeIntegerLike).join(',')
        : serializeIntegerLike(value);
    case 'chromaticLightness':
    case 'blackLightness':
    case 'whiteLightness':
      return value.map(serializeLightnessValue).join(',');
    case 'dyeColor':
      return [
        serializeIntegerLike(value[0]),
        serializePickerNumber(value[1]),
        serializePickerNumber(value[2]),
        serializePickerNumber(value[3]),
      ].join(',');
    case 'customBackgroundColor':
    case 'customForegroundColor':
      return [
        serializeIntegerLike(value[0]),
        serializePickerNumber(value[1]),
        serializePickerNumber(value[2]),
      ].join(',');
    default:
      return String(value);
  }
}
