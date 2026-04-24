import { describe, expect, it } from 'vitest';
import { createDefaultScheme } from '../src/services/SchemeState';
import {
  buildShareUrl,
  buildTwitterShareHref,
  SHARE_TEXT,
} from '../src/services/SocialShare';

describe('SocialShare', () => {
  it('builds a share URL with the current scheme query params', () => {
    const scheme = createDefaultScheme();
    scheme.hue = 12;
    scheme.hueSet = 'duotone';
    scheme.hueDistance = 18;
    scheme.degrees = [0, 18, 180, 198, 162, 342];

    expect(buildShareUrl(scheme, {
      origin: 'https://ciembor.github.io',
      pathname: '/4bit/',
    })).toBe(
      'https://ciembor.github.io/4bit/?hue=12&hueSet=duotone&hueDistance=18&degrees=0,18,180,198,162,342'
    );
  });

  it('builds a twitter intent link with the share text and encoded URL', () => {
    const scheme = createDefaultScheme();
    scheme.dyeScope = 'all';

    const href = buildTwitterShareHref(scheme, {
      origin: 'https://ciembor.github.io',
      pathname: '/4bit/',
    });
    const url = new URL(href);

    expect(`${url.origin}${url.pathname}`).toBe('https://twitter.com/intent/tweet');
    expect(url.searchParams.get('text')).toBe(SHARE_TEXT);
    expect(url.searchParams.get('via')).toBe('ciembor');
    expect(url.searchParams.get('url')).toBe('https://ciembor.github.io/4bit/?dyeScope=all');
  });
});
