import {
  PACKED_SCHEME_URL_SETTINGS_VERSION,
  TEXT_SCHEME_URL_SETTINGS_VERSION,
} from './schema';
import {
  decodePackedSchemeUrlSettings,
  encodePackedSchemeUrlSettings,
} from './packed-codec';
import {
  decodeTextSchemeUrlSettings,
  encodeTextSchemeUrlSettings,
} from './text-codec';
import {
  LEGACY_SCHEME_QUERY_KEYS,
  readLegacySchemeUrlSettings,
} from './legacy-query-codec';

export { LEGACY_SCHEME_QUERY_KEYS };

export const COMPRESSED_SCHEME_QUERY_KEY = 's';

export const SCHEME_QUERY_KEYS = Object.freeze([
  COMPRESSED_SCHEME_QUERY_KEY,
  ...LEGACY_SCHEME_QUERY_KEYS,
]);

export function encodeSchemeUrlSettings(scheme) {
  return encodePackedSchemeUrlSettings(scheme) || encodeTextSchemeUrlSettings(scheme);
}

export function decodeSchemeUrlSettings(value) {
  if (!value) {
    return null;
  }

  const encodedValue = String(value);
  const version = encodedValue[0];

  if (version === PACKED_SCHEME_URL_SETTINGS_VERSION) {
    return decodePackedSchemeUrlSettings(encodedValue.slice(1));
  }

  if (version === TEXT_SCHEME_URL_SETTINGS_VERSION) {
    return decodeTextSchemeUrlSettings(encodedValue);
  }

  return null;
}

export function readSchemeUrlSettingsFromParams(params) {
  return (
    decodeSchemeUrlSettings(params.get(COMPRESSED_SCHEME_QUERY_KEY)) ||
    readLegacySchemeUrlSettings(params)
  );
}
