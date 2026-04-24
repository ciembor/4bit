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
});
