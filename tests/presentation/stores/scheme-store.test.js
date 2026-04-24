import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { degreesForColorMode } from '../../../src/domain/scheme/color-mode';
import { createDefaultScheme } from '../../../src/domain/scheme/scheme-defaults';
import { useSchemeStore } from '../../../src/presentation/stores/scheme';

describe('Scheme store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('resets the full scheme back to defaults', () => {
    const schemeStore = useSchemeStore();

    schemeStore.scheme.hue = 12;
    schemeStore.scheme.degrees = [1, 2, 3, 4, 5, 6];
    schemeStore.scheme.dyeColor.hue = 210;
    schemeStore.scheme.customBackgroundColor.lightness = 35;

    schemeStore.resetScheme();

    const defaults = createDefaultScheme();
    expect(schemeStore.scheme).toEqual(defaults);
    expect(schemeStore.scheme).not.toBe(defaults);
    expect(schemeStore.scheme.degrees).not.toBe(defaults.degrees);
    expect(schemeStore.scheme.dyeColor).not.toBe(defaults.dyeColor);
    expect(schemeStore.scheme.customBackgroundColor).not.toBe(defaults.customBackgroundColor);
  });

  it('keeps preset color mode invariants inside store actions', () => {
    const schemeStore = useSchemeStore();

    schemeStore.setHue(210);
    schemeStore.setHueDistance(18);

    expect(schemeStore.setColorMode('duotone')).toBe(true);
    expect(schemeStore.scheme.hue).toBe(30);
    expect(schemeStore.scheme.colorMode).toBe('duotone');
    expect(schemeStore.scheme.degrees).toEqual(degreesForColorMode('duotone', 18));
  });

  it('clamps advanced ranges when updating or replacing the scheme', () => {
    const schemeStore = useSchemeStore();

    schemeStore.setSaturationRange(999);
    schemeStore.setLightnessRange(999);

    expect(schemeStore.scheme.saturationRange).toBe(50);
    expect(schemeStore.scheme.lightnessRange).toBe(30);

    schemeStore.replaceScheme({
      ...createDefaultScheme(),
      saturationRange: 999,
      lightnessRange: 999,
    });

    expect(schemeStore.scheme.saturationRange).toBe(50);
    expect(schemeStore.scheme.lightnessRange).toBe(30);
  });

  it('updates the remaining scheme fields through dedicated actions', () => {
    const schemeStore = useSchemeStore();
    const dyeColor = {
      hue: 210,
      saturation: 65,
      lightness: 55,
      alpha: 0.4,
    };
    const backgroundColor = {
      hue: 20,
      saturation: 15,
      lightness: 12,
    };
    const foregroundColor = {
      hue: 240,
      saturation: 25,
      lightness: 85,
    };

    schemeStore.setSaturation(63);
    schemeStore.setChromaticLightnessRange(48, 72);
    schemeStore.setBlackLightnessRange(3, 14);
    schemeStore.setWhiteLightnessRange(86, 99);
    schemeStore.setDyeColor(dyeColor);
    schemeStore.setDyeScope('all');
    schemeStore.setBackgroundColor(backgroundColor);
    schemeStore.setBackgroundMode('custom');
    schemeStore.setForegroundColor(foregroundColor);
    schemeStore.setForegroundMode('bright_white');

    expect(schemeStore.scheme.saturation).toBe(63);
    expect(schemeStore.scheme.normalChromaticLightness).toBe(48);
    expect(schemeStore.scheme.brightChromaticLightness).toBe(72);
    expect(schemeStore.scheme.normalBlackLightness).toBe(3);
    expect(schemeStore.scheme.brightBlackLightness).toBe(14);
    expect(schemeStore.scheme.normalWhiteLightness).toBe(86);
    expect(schemeStore.scheme.brightWhiteLightness).toBe(99);
    expect(schemeStore.scheme.dyeScope).toBe('all');
    expect(schemeStore.scheme.background).toBe('custom');
    expect(schemeStore.scheme.foreground).toBe('bright_white');

    expect(schemeStore.scheme.dyeColor).toEqual(dyeColor);
    expect(schemeStore.scheme.dyeColor).not.toBe(dyeColor);
    expect(schemeStore.scheme.customBackgroundColor).toEqual(backgroundColor);
    expect(schemeStore.scheme.customBackgroundColor).not.toBe(backgroundColor);
    expect(schemeStore.scheme.customForegroundColor).toEqual(foregroundColor);
    expect(schemeStore.scheme.customForegroundColor).not.toBe(foregroundColor);
  });
});
