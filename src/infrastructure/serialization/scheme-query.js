import { createDefaultScheme } from '../../domain/scheme/scheme-defaults';
import {
  clampHueDistance,
  degreesForColorMode,
  inferColorModeFromDegrees,
  isColorModeValue,
  normalizeColorModeValue,
} from '../../domain/scheme/color-mode';
import {
  clampLightnessRange,
  clampSaturationRange,
} from '../../domain/scheme/scheme-state';

const DYE_SCOPE_VALUES = Object.freeze(['none', 'all', 'achromatic', 'color']);
const SPECIAL_COLOR_VALUES = Object.freeze(['custom', 'black', 'bright_black', 'white', 'bright_white']);
export const SCHEME_QUERY_KEYS = Object.freeze([
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
const LIGHTNESS_STEP = 25 / 64;
const QUANTIZE_EPSILON = 1e-9;

function parseNumber(value) {
  if (value === null || value === '') {
    return null;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function parseNumberList(value, expectedLength) {
  const entries = String(value)
    .split(',')
    .map((entry) => parseNumber(entry));

  return entries.length === expectedLength && entries.every((entry) => entry !== null)
    ? entries
    : null;
}

function sameValue(first, second) {
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

function serializeSchemeQueryValue(key, value) {
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

function setParamIfChanged(params, key, value, defaultValue) {
  if (!sameValue(value, defaultValue)) {
    params.set(key, serializeSchemeQueryValue(key, value));
  }
}

function resolvedColorMode(scheme) {
  if (isColorModeValue(scheme.colorMode)) {
    const presetDegrees = degreesForColorMode(scheme.colorMode, scheme.hueDistance);
    const normalizedColorMode = normalizeColorModeValue(scheme.colorMode);

    if (presetDegrees && sameValue(scheme.degrees, presetDegrees)) {
      return normalizedColorMode;
    }
  }

  return inferColorModeFromDegrees(scheme.degrees, scheme.hueDistance);
}

function applyPresetDegreesIfMissing(scheme, hasDegreesParam) {
  if (hasDegreesParam) {
    return;
  }

  scheme.degrees = degreesForColorMode(scheme.colorMode, scheme.hueDistance);
}

function normalizeColorMode(scheme) {
  const inferredColorMode = inferColorModeFromDegrees(scheme.degrees, scheme.hueDistance);

  if (inferredColorMode) {
    scheme.colorMode = inferredColorMode;
    return;
  }

  scheme.colorMode = 'custom';
}

export function serializeSearchParams(params) {
  return Array.from(params.entries())
    .map(([key, value]) => (
      `${encodeURIComponent(key)}=${encodeURIComponent(value).replace(/%2C/gi, ',')}`
    ))
    .join('&');
}

export function readSchemeFromSearch(search = '') {
  const scheme = createDefaultScheme();
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);

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

  const degrees = parseNumberList(params.get('degrees'), 6);
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
  normalizeColorMode(scheme);

  return scheme;
}

export function buildSchemeQueryParams(scheme) {
  const params = new URLSearchParams();
  const defaults = createDefaultScheme();
  const colorMode = resolvedColorMode(scheme);
  const presetDegrees = colorMode ? degreesForColorMode(colorMode, scheme.hueDistance) : null;
  const hasRedundantDegrees = presetDegrees && sameValue(scheme.degrees, presetDegrees);

  setParamIfChanged(params, 'hue', scheme.hue, defaults.hue);
  if (colorMode && colorMode !== defaults.colorMode) {
    params.set('colorMode', colorMode);
  }
  setParamIfChanged(params, 'hueDistance', scheme.hueDistance, defaults.hueDistance);
  if (!hasRedundantDegrees) {
    setParamIfChanged(params, 'degrees', scheme.degrees, defaults.degrees);
  }
  setParamIfChanged(params, 'saturation', scheme.saturation, defaults.saturation);
  setParamIfChanged(params, 'saturationRange', scheme.saturationRange, defaults.saturationRange);
  setParamIfChanged(
    params,
    'chromaticLightness',
    [scheme.normalChromaticLightness, scheme.brightChromaticLightness],
    [defaults.normalChromaticLightness, defaults.brightChromaticLightness]
  );
  setParamIfChanged(params, 'lightnessRange', scheme.lightnessRange, defaults.lightnessRange);
  setParamIfChanged(
    params,
    'blackLightness',
    [scheme.normalBlackLightness, scheme.brightBlackLightness],
    [defaults.normalBlackLightness, defaults.brightBlackLightness]
  );
  setParamIfChanged(
    params,
    'whiteLightness',
    [scheme.normalWhiteLightness, scheme.brightWhiteLightness],
    [defaults.normalWhiteLightness, defaults.brightWhiteLightness]
  );
  setParamIfChanged(params, 'dyeScope', scheme.dyeScope, defaults.dyeScope);
  setParamIfChanged(
    params,
    'dyeColor',
    [
      scheme.dyeColor.hue,
      scheme.dyeColor.saturation,
      scheme.dyeColor.lightness,
      scheme.dyeColor.alpha,
    ],
    [
      defaults.dyeColor.hue,
      defaults.dyeColor.saturation,
      defaults.dyeColor.lightness,
      defaults.dyeColor.alpha,
    ]
  );
  setParamIfChanged(params, 'background', scheme.background, defaults.background);
  setParamIfChanged(
    params,
    'customBackgroundColor',
    [
      scheme.customBackgroundColor.hue,
      scheme.customBackgroundColor.saturation,
      scheme.customBackgroundColor.lightness,
    ],
    [
      defaults.customBackgroundColor.hue,
      defaults.customBackgroundColor.saturation,
      defaults.customBackgroundColor.lightness,
    ]
  );
  setParamIfChanged(params, 'foreground', scheme.foreground, defaults.foreground);
  setParamIfChanged(
    params,
    'customForegroundColor',
    [
      scheme.customForegroundColor.hue,
      scheme.customForegroundColor.saturation,
      scheme.customForegroundColor.lightness,
    ],
    [
      defaults.customForegroundColor.hue,
      defaults.customForegroundColor.saturation,
      defaults.customForegroundColor.lightness,
    ]
  );

  return params;
}

export function buildSchemeSearch(scheme) {
  const params = serializeSearchParams(buildSchemeQueryParams(scheme));
  return params ? `?${params}` : '';
}
