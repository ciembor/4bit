import { defineStore } from 'pinia';
import {
  cloneScheme,
  createDefaultScheme,
} from '../../domain/scheme/scheme-defaults';
import {
  applyColorModeToScheme,
  applyHueDistanceToScheme,
  clampLightnessRange,
  clampSaturationRange,
  normalizeSchemeRanges,
} from '../../domain/scheme/scheme-state';

export const useSchemeStore = defineStore('scheme', {
  state: () => ({
    scheme: createDefaultScheme(),
  }),
  actions: {
    resetScheme() {
      this.scheme = createDefaultScheme();
    },
    replaceScheme(scheme) {
      this.scheme = normalizeSchemeRanges(cloneScheme(scheme));
    },
    setHue(hue) {
      this.scheme.hue = hue;
    },
    setSaturation(saturation) {
      this.scheme.saturation = saturation;
    },
    setChromaticLightnessRange(normalLightness, brightLightness) {
      this.scheme.normalChromaticLightness = normalLightness;
      this.scheme.brightChromaticLightness = brightLightness;
    },
    setBlackLightnessRange(normalLightness, brightLightness) {
      this.scheme.normalBlackLightness = normalLightness;
      this.scheme.brightBlackLightness = brightLightness;
    },
    setWhiteLightnessRange(normalLightness, brightLightness) {
      this.scheme.normalWhiteLightness = normalLightness;
      this.scheme.brightWhiteLightness = brightLightness;
    },
    setDyeColor(color) {
      this.scheme.dyeColor = { ...color };
    },
    setDyeScope(scope) {
      this.scheme.dyeScope = scope;
    },
    setBackgroundColor(color) {
      this.scheme.customBackgroundColor = { ...color };
    },
    setBackgroundMode(mode) {
      this.scheme.background = mode;
    },
    setForegroundColor(color) {
      this.scheme.customForegroundColor = { ...color };
    },
    setForegroundMode(mode) {
      this.scheme.foreground = mode;
    },
    setColorMode(mode) {
      return applyColorModeToScheme(this.scheme, mode);
    },
    setHueDistance(distance) {
      return applyHueDistanceToScheme(this.scheme, distance);
    },
    setSaturationRange(range) {
      this.scheme.saturationRange = clampSaturationRange(range);
    },
    setLightnessRange(range) {
      this.scheme.lightnessRange = clampLightnessRange(range);
    },
  },
});
