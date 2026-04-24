import { describe, expect, it, vi } from 'vitest';
import { createPinia } from 'pinia';
import { createDefaultScheme } from '../src/services/SchemeState';
import { degreesForHueSet } from '../src/services/HueSetPresets';
import {
  buildSchemeSearch,
  hydrateSchemeStoreFromLocation,
  readSchemeFromSearch,
  resolveInitialSchemeSearch,
  SCHEME_STORAGE_KEY,
  SchemeUrlSync,
} from '../src/services/SchemeUrlState';

describe('SchemeUrlState', () => {
  it('returns the default scheme when the query string is empty', () => {
    expect(readSchemeFromSearch('')).toEqual(createDefaultScheme());
  });

  it('hydrates missing fields from defaults and derives preset degrees when omitted', () => {
    const scheme = readSchemeFromSearch(
      '?hue=25&hueSet=duotone&hueDistance=15&foreground=custom&customForegroundColor=210,60,70'
    );

    expect(scheme.hue).toBe(25);
    expect(scheme.hueSet).toBe('duotone');
    expect(scheme.hueDistance).toBe(15);
    expect(scheme.degrees).toEqual(degreesForHueSet('duotone', 15));
    expect(scheme.foreground).toBe('custom');
    expect(scheme.customForegroundColor).toEqual({
      hue: 210,
      saturation: 60,
      lightness: 70,
    });
    expect(scheme.saturation).toBe(createDefaultScheme().saturation);
    expect(scheme.dyeScope).toBe(createDefaultScheme().dyeScope);
  });

  it('accepts legacy hue-set aliases from older shared links', () => {
    const scheme = readSchemeFromSearch('?hueSet=duo&hueDistance=15');

    expect(scheme.hueSet).toBe('duotone');
    expect(scheme.degrees).toEqual(degreesForHueSet('duotone', 15));
  });

  it('canonicalizes legacy hue-set aliases when serializing them back to a link', () => {
    const scheme = readSchemeFromSearch('?hueSet=duo&hueDistance=15');
    const params = new URLSearchParams(buildSchemeSearch(scheme).slice(1));

    expect(params.get('hueSet')).toBe('duotone');
    expect(params.get('hueSet')).not.toBe('duo');
  });

  it('omits default values from the generated search string', () => {
    expect(buildSchemeSearch(createDefaultScheme())).toBe('');
  });

  it('roundtrips a custom scheme through the query string', () => {
    const scheme = createDefaultScheme();

    scheme.hue = 12;
    scheme.hueSet = 'custom';
    scheme.hueDistance = 18;
    scheme.degrees = [0, 23, 111, 187, 244, 301];
    scheme.saturation = 63;
    scheme.saturationRange = 7;
    scheme.normalChromaticLightness = 48;
    scheme.brightChromaticLightness = 72;
    scheme.lightnessRange = 4;
    scheme.normalBlackLightness = 2;
    scheme.brightBlackLightness = 15;
    scheme.normalWhiteLightness = 86;
    scheme.brightWhiteLightness = 99;
    scheme.dyeScope = 'color';
    scheme.dyeColor = {
      hue: 120,
      saturation: 70,
      lightness: 55,
      alpha: 0.5,
    };
    scheme.background = 'custom';
    scheme.customBackgroundColor = {
      hue: 40,
      saturation: 30,
      lightness: 15,
    };
    scheme.foreground = 'bright_white';
    scheme.customForegroundColor = {
      hue: 260,
      saturation: 20,
      lightness: 80,
    };

    expect(readSchemeFromSearch(buildSchemeSearch(scheme))).toEqual(scheme);
  });

  it('serializes quantized numeric values compactly without losing precision', () => {
    const scheme = createDefaultScheme();

    scheme.normalChromaticLightness = 127 / 2.56;
    scheme.brightChromaticLightness = 191 / 2.56;
    scheme.normalBlackLightness = 1 / 2.56;
    scheme.brightBlackLightness = 32 / 2.56;
    scheme.dyeColor = {
      hue: 180,
      saturation: 50.1,
      lightness: 50.25,
      alpha: 0.25,
    };

    const params = new URLSearchParams(buildSchemeSearch(scheme).slice(1));

    expect(params.get('chromaticLightness')).toBe('49.609375,74.609375');
    expect(params.get('blackLightness')).toBe('0.390625,12.5');
    expect(params.get('dyeColor')).toBe('180,50.1,50.25,0.25');
    expect(readSchemeFromSearch(`?${params.toString()}`)).toEqual(scheme);
  });

  it('keeps comma-separated numeric lists readable in the generated URL', () => {
    const scheme = createDefaultScheme();

    scheme.normalChromaticLightness = 120 / 2.56;
    scheme.brightChromaticLightness = 192 / 2.56;
    scheme.normalBlackLightness = 1 / 2.56;
    scheme.brightBlackLightness = 32 / 2.56;

    const search = buildSchemeSearch(scheme);

    expect(search).toContain('chromaticLightness=46.875,75');
    expect(search).toContain('blackLightness=0.390625,12.5');
    expect(search).not.toContain('%2C');
  });

  it('preserves unrelated query params while updating scheme params', () => {
    const scheme = createDefaultScheme();
    scheme.hue = 10;
    scheme.dyeScope = 'all';

    const location = {
      pathname: '/4bit/',
      search: '?utm_source=readme&hue=5',
      hash: '#preview',
    };
    const history = {
      state: { any: 'value' },
      replaceState: vi.fn(),
    };

    new SchemeUrlSync({
      schemeStore: { scheme },
      location,
      history,
    }).updateLocation(scheme);

    expect(history.replaceState).toHaveBeenCalledWith(
      history.state,
      '',
      '/4bit/?utm_source=readme&hue=10&dyeScope=all#preview'
    );
  });

  it('ignores malformed values and falls back to defaults for those fields', () => {
    const scheme = readSchemeFromSearch(
      '?hue=oops&degrees=1,2,3&dyeColor=1,2,3&foreground=invalid&customForegroundColor=4,5'
    );
    const defaults = createDefaultScheme();

    expect(scheme.hue).toBe(defaults.hue);
    expect(scheme.degrees).toEqual(defaults.degrees);
    expect(scheme.dyeColor).toEqual(defaults.dyeColor);
    expect(scheme.foreground).toBe(defaults.foreground);
    expect(scheme.customForegroundColor).toEqual(defaults.customForegroundColor);
  });

  it('prefers explicit scheme params in the URL over persisted state', () => {
    const storage = {
      getItem: vi.fn(() => '?hue=45&dyeScope=all'),
    };

    expect(resolveInitialSchemeSearch('?hue=12', storage)).toBe('?hue=12');
  });

  it('falls back to persisted scheme params and preserves unrelated URL params', () => {
    const storage = {
      getItem: vi.fn(() => '?hue=45&dyeScope=all'),
    };

    expect(resolveInitialSchemeSearch('?utm_source=readme', storage))
      .toBe('?utm_source=readme&hue=45&dyeScope=all');
  });

  it('hydrates the store from persisted search when the URL has no scheme params', () => {
    const pinia = createPinia();
    const storage = {
      getItem: vi.fn(() => '?hue=45&dyeScope=all'),
    };
    const location = {
      pathname: '/4bit/',
      search: '',
      hash: '#preview',
    };
    const history = {
      state: { from: 'test' },
      replaceState: vi.fn(),
    };

    const schemeStore = hydrateSchemeStoreFromLocation(pinia, {
      search: location.search,
      storage,
      location,
      history,
    });

    expect(schemeStore.scheme.hue).toBe(45);
    expect(schemeStore.scheme.dyeScope).toBe('all');
    expect(history.replaceState).toHaveBeenCalledWith(
      history.state,
      '',
      '/4bit/?hue=45&dyeScope=all#preview'
    );
  });

  it('persists the current scheme search for future visits', () => {
    const scheme = createDefaultScheme();
    scheme.hue = 10;
    scheme.dyeScope = 'all';

    const storage = {
      setItem: vi.fn(),
    };

    new SchemeUrlSync({
      schemeStore: { scheme },
      location: {
        pathname: '/4bit/',
        search: '',
        hash: '',
      },
      history: {
        state: null,
        replaceState: vi.fn(),
      },
      storage,
    }).updateLocation(scheme);

    expect(storage.setItem).toHaveBeenCalledWith(
      SCHEME_STORAGE_KEY,
      '?hue=10&dyeScope=all'
    );
  });
});
