import { buildSchemeSearch } from './scheme-query';

export const SHARE_TEXT = 'Terminal color scheme from 4bit:';
const SHARE_BASE_URL = 'https://ciembor.github.io/4bit/';
const DEFAULT_SHARE_URL = new URL(SHARE_BASE_URL);
const PRIVATE_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);

function resolveShareBaseLocation(location = null) {
  if (location?.origin && location?.pathname) {
    const currentUrl = new URL(`${location.origin}${location.pathname}`);

    if (
      currentUrl.protocol === 'https:' &&
      !PRIVATE_HOSTNAMES.has(currentUrl.hostname) &&
      !currentUrl.hostname.endsWith('.local')
    ) {
      return {
        origin: currentUrl.origin,
        pathname: currentUrl.pathname,
      };
    }
  }

  return {
    origin: DEFAULT_SHARE_URL.origin,
    pathname: DEFAULT_SHARE_URL.pathname,
  };
}

export function buildShareUrl(scheme, location = null) {
  const { origin, pathname } = resolveShareBaseLocation(location);

  return `${origin}${pathname}${buildSchemeSearch(scheme)}`;
}

export function buildTwitterShareHref(scheme, location = null) {
  const params = new URLSearchParams({
    text: SHARE_TEXT,
    url: buildShareUrl(scheme, location),
    via: 'ciembor',
  });

  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function buildLinkedInShareHref(scheme, location = null) {
  const params = new URLSearchParams({
    url: buildShareUrl(scheme, location),
  });

  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
}

export function buildFacebookShareHref(scheme, location = null) {
  const params = new URLSearchParams({
    u: buildShareUrl(scheme, location),
  });

  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

export function defaultShareBaseUrl() {
  return SHARE_BASE_URL;
}
