export const TEXT_SCHEME_URL_SETTINGS_VERSION = '1';
export const PACKED_SCHEME_URL_SETTINGS_VERSION = '2';
export const TEXT_FIELD_SEPARATOR = '~';
export const TEXT_SCHEME_FIELD_COUNT = 17;
export const SCHEME_DEGREE_COUNT = 6;

export const COLOR_MODE_TEXT_CODES = Object.freeze({
  custom: 'c',
  monochrome: 'm',
  duotone: 'd',
  tricolor: 't',
  hexachrome: 'h',
});

export const DYE_SCOPE_TEXT_CODES = Object.freeze({
  none: 'n',
  all: 'a',
  achromatic: 'g',
  color: 'c',
});

export const SPECIAL_COLOR_TEXT_CODES = Object.freeze({
  custom: 'c',
  black: 'k',
  bright_black: 'K',
  white: 'w',
  bright_white: 'W',
});

export const COLOR_MODE_TEXT_VALUES = invertMap(COLOR_MODE_TEXT_CODES);
export const DYE_SCOPE_TEXT_VALUES = invertMap(DYE_SCOPE_TEXT_CODES);
export const SPECIAL_COLOR_TEXT_VALUES = invertMap(SPECIAL_COLOR_TEXT_CODES);

export const COLOR_MODE_PACKED_VALUES = Object.freeze([
  'custom',
  'monochrome',
  'duotone',
  'tricolor',
  'hexachrome',
]);

export const DYE_SCOPE_PACKED_VALUES = Object.freeze(['none', 'all', 'achromatic', 'color']);

export const SPECIAL_COLOR_PACKED_VALUES = Object.freeze([
  'custom',
  'black',
  'bright_black',
  'white',
  'bright_white',
]);

function invertMap(map) {
  return Object.freeze(Object.fromEntries(
    Object.entries(map).map(([key, value]) => [value, key])
  ));
}

export function codeFor(map, value) {
  return map[value] || null;
}

export function valueFor(map, code) {
  return map[code] || null;
}
