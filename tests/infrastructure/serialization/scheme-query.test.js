import { describe, expect, it } from 'vitest';
import { degreesForColorMode } from '../../../src/domain/scheme/color-mode';
import { createDefaultScheme } from '../../../src/domain/scheme/scheme-defaults';
import {
  buildSchemeSearch,
  readSchemeFromSearch,
} from '../../../src/infrastructure/serialization/scheme-query';

describe('scheme-query', () => {
  it('returns the default scheme when the query string is empty', () => {
    expect(readSchemeFromSearch('')).toEqual(createDefaultScheme());
  });

  it('hydrates missing fields from defaults and derives preset degrees when omitted', () => {
    const scheme = readSchemeFromSearch(
      '?hue=25&colorMode=duotone&hueDistance=15&foreground=custom&customForegroundColor=210,60,70'
    );

    expect(scheme.hue).toBe(25);
    expect(scheme.colorMode).toBe('duotone');
    expect(scheme.hueDistance).toBe(15);
    expect(scheme.degrees).toEqual(degreesForColorMode('duotone', 15));
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

    expect(scheme.colorMode).toBe('duotone');
    expect(scheme.degrees).toEqual(degreesForColorMode('duotone', 15));
  });

  it('canonicalizes legacy hue-set aliases when serializing them back to a link', () => {
    const scheme = readSchemeFromSearch('?hueSet=duo&hueDistance=15');
    const params = new URLSearchParams(buildSchemeSearch(scheme).slice(1));

    expect(params.get('colorMode')).toBe('duotone');
    expect(params.get('hueSet')).toBeNull();
  });

  it('omits default values from the generated search string', () => {
    expect(buildSchemeSearch(createDefaultScheme())).toBe('');
  });

  it('omits degrees when they are implied by hue-set and hue-distance', () => {
    const scheme = createDefaultScheme();

    scheme.hue = 12;
    scheme.colorMode = 'duotone';
    scheme.hueDistance = 18;
    scheme.degrees = degreesForColorMode('duotone', 18);

    expect(buildSchemeSearch(scheme)).toBe('?hue=12&colorMode=duotone&hueDistance=18');
  });

  it('roundtrips a custom scheme through the query string', () => {
    const scheme = createDefaultScheme();

    scheme.hue = 12;
    scheme.colorMode = 'custom';
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

  it('clamps advanced ranges from shared links to the same limits as the UI', () => {
    const scheme = readSchemeFromSearch('?saturationRange=999&lightnessRange=999');

    expect(scheme.saturationRange).toBe(50);
    expect(scheme.lightnessRange).toBe(30);
  });
});
