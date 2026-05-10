import { describe, expect, it } from 'vitest';
import { degreesForColorMode } from '../../../src/domain/scheme/color-mode';
import { createDefaultScheme } from '../../../src/domain/scheme/scheme-defaults';
import {
  decodeSchemeUrlSettings,
  encodeSchemeUrlSettings,
} from '../../../src/infrastructure/url/scheme-settings';

const DEFAULT_ENCODED_SCHEME = [
  '1',
  '-15',
  'h',
  '0',
  '0,60,120,180,240,300',
  '50',
  '0',
  '50,75',
  '0',
  '0,12.5',
  '87.5,100',
  'n',
  '180,50,50,0.25',
  'k',
  '180,50,10',
  'w',
  '180,50,90',
].join('~');

function createCustomScheme() {
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

  return scheme;
}

describe('scheme-url-settings', () => {
  it('encodes the complete default scheme in the compact packed URL format', () => {
    const encoded = encodeSchemeUrlSettings(createDefaultScheme());

    expect(encoded).toMatch(/^2[A-Za-z0-9_-]+$/);
    expect(encoded.length).toBeLessThan(55);
    expect(decodeSchemeUrlSettings(encoded)).toEqual(createDefaultScheme());
  });

  it('keeps support for the text v1 URL payload', () => {
    expect(decodeSchemeUrlSettings(DEFAULT_ENCODED_SCHEME)).toEqual(createDefaultScheme());
  });

  it('roundtrips every setting without encoded color output', () => {
    const scheme = createCustomScheme();

    expect(decodeSchemeUrlSettings(encodeSchemeUrlSettings(scheme))).toEqual(scheme);
  });

  it('canonicalizes stale color mode values when explicit degrees are custom', () => {
    const scheme = createDefaultScheme();

    scheme.colorMode = 'duotone';
    scheme.hueDistance = 18;
    scheme.degrees = [0, 1, 2, 3, 4, 5];

    const decoded = decodeSchemeUrlSettings(encodeSchemeUrlSettings(scheme));

    expect(decoded.colorMode).toBe('custom');
    expect(decoded.degrees).toEqual(scheme.degrees);
  });

  it('keeps preset modes canonical when the degrees match the preset', () => {
    const scheme = createDefaultScheme();

    scheme.colorMode = 'duotone';
    scheme.hueDistance = 18;
    scheme.degrees = degreesForColorMode('duotone', 18);

    const decoded = decodeSchemeUrlSettings(encodeSchemeUrlSettings(scheme));

    expect(decoded.colorMode).toBe('duotone');
    expect(decoded.degrees).toEqual(degreesForColorMode('duotone', 18));
  });

  it('rejects malformed or unsupported payloads', () => {
    expect(decodeSchemeUrlSettings('')).toBeNull();
    expect(decodeSchemeUrlSettings('2~unsupported')).toBeNull();
    expect(decodeSchemeUrlSettings('1~too~short')).toBeNull();
    expect(decodeSchemeUrlSettings(DEFAULT_ENCODED_SCHEME.replace('50', 'oops'))).toBeNull();
  });
});
