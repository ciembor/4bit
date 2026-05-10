import {
  COMPRESSED_SCHEME_QUERY_KEY,
  encodeSchemeUrlSettings,
  LEGACY_SCHEME_QUERY_KEYS,
  readSchemeUrlSettingsFromParams,
  SCHEME_QUERY_KEYS,
} from './scheme-settings';

export {
  LEGACY_SCHEME_QUERY_KEYS,
  SCHEME_QUERY_KEYS,
};

export function serializeSearchParams(params) {
  return Array.from(params.entries())
    .map(([key, value]) => (
      `${encodeURIComponent(key)}=${encodeURIComponent(value).replace(/%2C/gi, ',')}`
    ))
    .join('&');
}

export function readSchemeFromSearch(search = '') {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);

  return readSchemeUrlSettingsFromParams(params);
}

export function buildSchemeQueryParams(scheme) {
  const params = new URLSearchParams();

  params.set(COMPRESSED_SCHEME_QUERY_KEY, encodeSchemeUrlSettings(scheme));

  return params;
}

export function buildSchemeSearch(scheme) {
  return `?${serializeSearchParams(buildSchemeQueryParams(scheme))}`;
}
