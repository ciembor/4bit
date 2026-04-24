<template>
  <BaseSlider
    :value="sliderValue"
    :min="min"
    :max="max"
    :step="step"
    @update="updateHue"
  />
</template>

<script>
import BaseSlider from "./BaseSlider.vue";
import { useSchemeStore } from "../../../stores/scheme";
import {
  colorModeHueCycle,
  normalizeHueForColorMode,
} from "../../../../domain/scheme/color-mode";

export default {
  name: "HueSlider",
  components: {
    BaseSlider,
  },
  setup() {
    const schemeStore = useSchemeStore();
    return { schemeStore };
  },
  computed: {
    cycle() {
      return colorModeHueCycle(this.schemeStore.scheme.colorMode);
    },
    sliderValue() {
      const rawHue = Number(this.schemeStore.scheme.hue);
      const min = this.min;
      const max = this.max;

      if (Number.isFinite(rawHue) && rawHue >= min && rawHue <= max) {
        return rawHue;
      }

      return normalizeHueForColorMode(rawHue, this.schemeStore.scheme.colorMode);
    },
    min() {
      return -(this.cycle / 2);
    },
    max() {
      return this.cycle / 2;
    },
    step() {
      return 1;
    },
  },
  methods: {
    updateHue(sliderValue) {
      this.schemeStore.setHue(sliderValue);
    },
  },
};
</script>
