import { describe, expect, it } from 'vitest';
import {
  cloneScheme,
  createDefaultScheme,
  SCHEME_DEFAULTS,
} from '../../../src/domain/scheme/scheme-defaults';

describe('scheme-defaults', () => {
  it('creates deep-cloned default schemes', () => {
    const scheme = createDefaultScheme();

    expect(scheme).toEqual(SCHEME_DEFAULTS);
    expect(scheme).not.toBe(SCHEME_DEFAULTS);
    expect(scheme.degrees).not.toBe(SCHEME_DEFAULTS.degrees);
    expect(scheme.dyeColor).not.toBe(SCHEME_DEFAULTS.dyeColor);
    expect(scheme.customBackgroundColor).not.toBe(SCHEME_DEFAULTS.customBackgroundColor);
    expect(scheme.customForegroundColor).not.toBe(SCHEME_DEFAULTS.customForegroundColor);
  });

  it('clones nested scheme values without sharing references', () => {
    const original = createDefaultScheme();
    const cloned = cloneScheme(original);

    cloned.degrees[0] = 42;
    cloned.dyeColor.hue = 90;
    cloned.customBackgroundColor.lightness = 33;
    cloned.customForegroundColor.lightness = 77;

    expect(original.degrees[0]).not.toBe(cloned.degrees[0]);
    expect(original.dyeColor.hue).not.toBe(cloned.dyeColor.hue);
    expect(original.customBackgroundColor.lightness).not.toBe(
      cloned.customBackgroundColor.lightness
    );
    expect(original.customForegroundColor.lightness).not.toBe(
      cloned.customForegroundColor.lightness
    );
  });
});
