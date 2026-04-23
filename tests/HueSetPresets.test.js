import { describe, expect, it } from 'vitest';
import {
  degreesForHueSet,
  hueCycleForHueSet,
  normalizeHueForHueSet,
} from '../src/services/HueSetPresets';

describe('HueSetPresets', () => {
  it('uses complementary families for duotone presets', () => {
    expect(degreesForHueSet('duotone', 20)).toEqual([0, 20, 180, 200, 160, 340]);
  });

  it('returns hue cycles that match each preset symmetry', () => {
    expect(hueCycleForHueSet('monochrome')).toBe(360);
    expect(hueCycleForHueSet('duotone')).toBe(180);
    expect(hueCycleForHueSet('tricolor')).toBe(120);
    expect(hueCycleForHueSet('hexachrome')).toBe(60);
    expect(hueCycleForHueSet('custom')).toBe(360);
  });

  it('normalizes hues into the visible slider range for each preset', () => {
    expect(normalizeHueForHueSet(200, 'monochrome')).toBe(-160);
    expect(normalizeHueForHueSet(210, 'duotone')).toBe(30);
    expect(normalizeHueForHueSet(100, 'tricolor')).toBe(-20);
    expect(normalizeHueForHueSet(75, 'hexachrome')).toBe(15);
  });
});
