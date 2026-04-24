import { describe, expect, it } from 'vitest';
import { createDefaultScheme } from '../../../src/domain/scheme/scheme-defaults';
import {
  buildFacebookShareHref,
  buildLinkedInShareHref,
  buildShareUrl,
  buildTwitterShareHref,
  defaultShareBaseUrl,
  SHARE_TEXT,
} from '../../../src/infrastructure/serialization/share-urls';

describe('share-urls', () => {
  it('builds a share URL with the current scheme query params', () => {
    const scheme = createDefaultScheme();
    scheme.hue = 12;
    scheme.colorMode = 'duotone';
    scheme.hueDistance = 18;
    scheme.degrees = [0, 18, 180, 198, 162, 342];

    expect(buildShareUrl(scheme, {
      origin: 'https://ciembor.github.io',
      pathname: '/4bit/',
    })).toBe(
      'https://ciembor.github.io/4bit/?hue=12&colorMode=duotone&hueDistance=18'
    );
  });

  it('builds a twitter intent link with the encoded URL', () => {
    const scheme = createDefaultScheme();
    scheme.dyeScope = 'all';

    const href = buildTwitterShareHref(scheme, {
      origin: 'https://ciembor.github.io',
      pathname: '/4bit/',
    });
    const url = new URL(href);

    expect(`${url.origin}${url.pathname}`).toBe('https://twitter.com/intent/tweet');
    expect(url.searchParams.get('text')).toBe(SHARE_TEXT);
    expect(url.searchParams.get('url')).toBe('https://ciembor.github.io/4bit/?dyeScope=all');
    expect(url.searchParams.get('via')).toBe('ciembor');
  });

  it('falls back to the public share URL when current location is local', () => {
    const scheme = createDefaultScheme();
    scheme.dyeScope = 'all';

    expect(buildShareUrl(scheme, {
      origin: 'http://localhost:5173',
      pathname: '/',
    })).toBe('https://ciembor.github.io/4bit/?dyeScope=all');
  });

  it('builds a linkedin share link with the encoded URL', () => {
    const scheme = createDefaultScheme();
    scheme.dyeScope = 'all';

    const href = buildLinkedInShareHref(scheme, {
      origin: 'https://ciembor.github.io',
      pathname: '/4bit/',
    });
    const url = new URL(href);

    expect(`${url.origin}${url.pathname}`).toBe('https://www.linkedin.com/sharing/share-offsite/');
    expect(url.searchParams.get('url')).toBe('https://ciembor.github.io/4bit/?dyeScope=all');
  });

  it('builds a facebook share link with the encoded URL', () => {
    const scheme = createDefaultScheme();
    scheme.dyeScope = 'all';

    const href = buildFacebookShareHref(scheme, {
      origin: 'https://ciembor.github.io',
      pathname: '/4bit/',
    });
    const url = new URL(href);

    expect(`${url.origin}${url.pathname}`).toBe('https://www.facebook.com/sharer/sharer.php');
    expect(url.searchParams.get('u')).toBe('https://ciembor.github.io/4bit/?dyeScope=all');
  });

  it('uses the production share URL defaults when location is unavailable', () => {
    expect(buildShareUrl(createDefaultScheme())).toBe('https://ciembor.github.io/4bit/');
    expect(defaultShareBaseUrl()).toBe('https://ciembor.github.io/4bit/');
  });
});
