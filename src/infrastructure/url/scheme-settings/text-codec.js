import { resolveSchemeColorMode } from './canonicalization';
import { hydrateSchemeSettings } from './mapper';
import {
  codeFor,
  COLOR_MODE_TEXT_CODES,
  COLOR_MODE_TEXT_VALUES,
  DYE_SCOPE_TEXT_CODES,
  DYE_SCOPE_TEXT_VALUES,
  SCHEME_DEGREE_COUNT,
  SPECIAL_COLOR_TEXT_CODES,
  SPECIAL_COLOR_TEXT_VALUES,
  TEXT_FIELD_SEPARATOR,
  TEXT_SCHEME_FIELD_COUNT,
  TEXT_SCHEME_URL_SETTINGS_VERSION,
  valueFor,
} from './schema';
import {
  parseNumber,
  parseNumberList,
  serializeSchemeSettingValue,
} from './value-codec';

function encodedTextValues(scheme) {
  return [
    TEXT_SCHEME_URL_SETTINGS_VERSION,
    serializeSchemeSettingValue('hue', scheme.hue),
    codeFor(COLOR_MODE_TEXT_CODES, resolveSchemeColorMode(scheme)),
    serializeSchemeSettingValue('hueDistance', scheme.hueDistance),
    serializeSchemeSettingValue('degrees', scheme.degrees),
    serializeSchemeSettingValue('saturation', scheme.saturation),
    serializeSchemeSettingValue('saturationRange', scheme.saturationRange),
    serializeSchemeSettingValue('chromaticLightness', [
      scheme.normalChromaticLightness,
      scheme.brightChromaticLightness,
    ]),
    serializeSchemeSettingValue('lightnessRange', scheme.lightnessRange),
    serializeSchemeSettingValue('blackLightness', [
      scheme.normalBlackLightness,
      scheme.brightBlackLightness,
    ]),
    serializeSchemeSettingValue('whiteLightness', [
      scheme.normalWhiteLightness,
      scheme.brightWhiteLightness,
    ]),
    codeFor(DYE_SCOPE_TEXT_CODES, scheme.dyeScope),
    serializeSchemeSettingValue('dyeColor', [
      scheme.dyeColor.hue,
      scheme.dyeColor.saturation,
      scheme.dyeColor.lightness,
      scheme.dyeColor.alpha,
    ]),
    codeFor(SPECIAL_COLOR_TEXT_CODES, scheme.background),
    serializeSchemeSettingValue('customBackgroundColor', [
      scheme.customBackgroundColor.hue,
      scheme.customBackgroundColor.saturation,
      scheme.customBackgroundColor.lightness,
    ]),
    codeFor(SPECIAL_COLOR_TEXT_CODES, scheme.foreground),
    serializeSchemeSettingValue('customForegroundColor', [
      scheme.customForegroundColor.hue,
      scheme.customForegroundColor.saturation,
      scheme.customForegroundColor.lightness,
    ]),
  ];
}

function hydrateSchemeFromTextFields(fields) {
  const [
    version,
    hueValue,
    colorModeValue,
    hueDistanceValue,
    degreesValue,
    saturationValue,
    saturationRangeValue,
    chromaticLightnessValue,
    lightnessRangeValue,
    blackLightnessValue,
    whiteLightnessValue,
    dyeScopeValue,
    dyeColorValue,
    backgroundValue,
    customBackgroundColorValue,
    foregroundValue,
    customForegroundColorValue,
  ] = fields;

  if (version !== TEXT_SCHEME_URL_SETTINGS_VERSION) {
    return null;
  }

  return hydrateSchemeSettings({
    hue: parseNumber(hueValue),
    colorMode: valueFor(COLOR_MODE_TEXT_VALUES, colorModeValue),
    hueDistance: hueDistanceValue,
    degrees: parseNumberList(degreesValue, SCHEME_DEGREE_COUNT),
    saturation: parseNumber(saturationValue),
    saturationRange: saturationRangeValue,
    chromaticLightness: parseNumberList(chromaticLightnessValue, 2),
    lightnessRange: lightnessRangeValue,
    blackLightness: parseNumberList(blackLightnessValue, 2),
    whiteLightness: parseNumberList(whiteLightnessValue, 2),
    dyeScope: valueFor(DYE_SCOPE_TEXT_VALUES, dyeScopeValue),
    dyeColor: parseNumberList(dyeColorValue, 4),
    background: valueFor(SPECIAL_COLOR_TEXT_VALUES, backgroundValue),
    customBackgroundColor: parseNumberList(customBackgroundColorValue, 3),
    foreground: valueFor(SPECIAL_COLOR_TEXT_VALUES, foregroundValue),
    customForegroundColor: parseNumberList(customForegroundColorValue, 3),
  });
}

export function encodeTextSchemeUrlSettings(scheme) {
  return encodedTextValues(scheme).join(TEXT_FIELD_SEPARATOR);
}

export function decodeTextSchemeUrlSettings(value) {
  if (!value) {
    return null;
  }

  const fields = String(value).split(TEXT_FIELD_SEPARATOR);

  return fields.length === TEXT_SCHEME_FIELD_COUNT
    ? hydrateSchemeFromTextFields(fields)
    : null;
}
