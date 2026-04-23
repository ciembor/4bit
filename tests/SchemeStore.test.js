import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createDefaultScheme } from '../src/services/SchemeState';
import { useSchemeStore } from '../src/stores/Scheme';

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
});
