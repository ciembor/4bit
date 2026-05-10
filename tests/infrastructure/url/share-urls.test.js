import { describe, expect, it } from 'vitest';
import Color from 'color';
import { createDefaultScheme } from '../../../src/domain/scheme/scheme-defaults';
import {
  buildFacebookShareHref,
  buildLinkedInShareHref,
  buildShareUrl,
  buildTwitterShareHref,
  defaultShareBaseUrl,
  SHARE_TEXT,
} from '../../../src/infrastructure/url/share-urls';
import { buildSchemeSearch } from '../../../src/infrastructure/url/scheme-query';

const MINTTY_DRAG_SCHEME = [
  '101010',
  'F0F0F0',
  'F0F0F0',
  '000000',
  'CC0000',
  '00AA00',
  'AA5500',
  '0000AA',
  'AA00AA',
  '00AAAA',
  'AAAAAA',
  '808080',
  'FF5555',
  '55FF55',
  'FFFF55',
  '5555FF',
  'FF55FF',
  '55FFFF',
  'FFFFFF',
].join(':');
const MINTTY_DRAG_HASH = `#?scheme=${MINTTY_DRAG_SCHEME}`;

function createColors() {
  return {
    background: Color('#101010'),
    foreground: Color('#f0f0f0'),
    black: Color('#000000'),
    brightBlack: Color('#808080'),
    red: Color('#cc0000'),
    brightRed: Color('#ff5555'),
    green: Color('#00aa00'),
    brightGreen: Color('#55ff55'),
    yellow: Color('#aa5500'),
    brightYellow: Color('#ffff55'),
    blue: Color('#0000aa'),
    brightBlue: Color('#5555ff'),
    magenta: Color('#aa00aa'),
    brightMagenta: Color('#ff55ff'),
    cyan: Color('#00aaaa'),
    brightCyan: Color('#55ffff'),
    white: Color('#aaaaaa'),
    brightWhite: Color('#ffffff'),
  };
}

describe('share-urls', () => {
  it('builds a share URL with compressed settings and mintty drag payload', () => {
    const scheme = createDefaultScheme();
    scheme.hue = 12;
    scheme.colorMode = 'duotone';
    scheme.hueDistance = 18;
    scheme.degrees = [0, 18, 180, 198, 162, 342];

    expect(buildShareUrl({
      scheme,
      colors: createColors(),
      location: {
        origin: 'https://ciembor.github.io',
        pathname: '/4bit/',
      },
    })).toBe(
      `https://ciembor.github.io/4bit/${buildSchemeSearch(scheme)}${MINTTY_DRAG_HASH}`
    );
  });

  it('builds a twitter intent link with compressed settings but without the mintty scheme hash', () => {
    const scheme = createDefaultScheme();
    scheme.dyeScope = 'all';

    const href = buildTwitterShareHref({
      scheme,
      colors: createColors(),
      location: {
        origin: 'https://ciembor.github.io',
        pathname: '/4bit/',
      },
    });
    const url = new URL(href);

    expect(`${url.origin}${url.pathname}`).toBe('https://twitter.com/intent/tweet');
    expect(url.searchParams.get('text')).toBe(SHARE_TEXT);
    expect(url.searchParams.get('url')).toBe(
      `https://ciembor.github.io/4bit/${buildSchemeSearch(scheme)}`
    );
    expect(url.searchParams.get('via')).toBe('ciembor');
  });

  it('falls back to the public share URL when current location is local', () => {
    const scheme = createDefaultScheme();
    scheme.dyeScope = 'all';

    expect(buildShareUrl({
      scheme,
      location: {
        origin: 'http://localhost:5173',
        pathname: '/',
      },
    })).toBe(`https://ciembor.github.io/4bit/${buildSchemeSearch(scheme)}`);
  });

  it('builds a linkedin share link with the encoded URL', () => {
    const scheme = createDefaultScheme();
    scheme.dyeScope = 'all';

    const href = buildLinkedInShareHref({
      scheme,
      colors: createColors(),
      location: {
        origin: 'https://ciembor.github.io',
        pathname: '/4bit/',
      },
    });
    const url = new URL(href);

    expect(`${url.origin}${url.pathname}`).toBe('https://www.linkedin.com/sharing/share-offsite/');
    expect(url.searchParams.get('url')).toBe(
      `https://ciembor.github.io/4bit/${buildSchemeSearch(scheme)}${MINTTY_DRAG_HASH}`
    );
  });

  it('builds a facebook share link with the encoded URL', () => {
    const scheme = createDefaultScheme();
    scheme.dyeScope = 'all';

    const href = buildFacebookShareHref({
      scheme,
      colors: createColors(),
      location: {
        origin: 'https://ciembor.github.io',
        pathname: '/4bit/',
      },
    });
    const url = new URL(href);

    expect(`${url.origin}${url.pathname}`).toBe('https://www.facebook.com/sharer/sharer.php');
    expect(url.searchParams.get('u')).toBe(
      `https://ciembor.github.io/4bit/${buildSchemeSearch(scheme)}${MINTTY_DRAG_HASH}`
    );
  });

  it('uses the production share URL defaults when location is unavailable', () => {
    const scheme = createDefaultScheme();

    expect(buildShareUrl({ scheme })).toBe(`https://ciembor.github.io/4bit/${buildSchemeSearch(scheme)}`);
    expect(defaultShareBaseUrl()).toBe('https://ciembor.github.io/4bit/');
  });
});
