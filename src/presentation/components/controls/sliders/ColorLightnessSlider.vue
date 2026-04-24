<template>
  <BaseSlider
    :range="true"
    :values="sliderValues"
    :min="min"
    :max="max"
    :step="step"
    @update="updateLightness"
  />
</template>

<script>
import BaseSlider from "./BaseSlider.vue";
import { useSchemeStore } from "../../../stores/scheme";

export default {
  name: "ColorLightnessRangeSlider",
  components: {
    BaseSlider,
  },
  setup() {
    const schemeStore = useSchemeStore();
    return { schemeStore };
  },
  computed: {
    sliderValues() {
      return [
        this.schemeStore.scheme.normalChromaticLightness * 2.56,
        this.schemeStore.scheme.brightChromaticLightness * 2.56,
      ];
    },
    min() {
      return 0;
    },
    max() {
      return 256;
    },
    step() {
      return 1;
    },
  },
  methods: {
    updateLightness(values) {
      this.schemeStore.setChromaticLightnessRange(
        values[0] / 2.56,
        values[1] / 2.56
      );
    },
  },
};
</script>
