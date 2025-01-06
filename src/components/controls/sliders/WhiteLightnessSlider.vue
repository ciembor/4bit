<template>
  <BaseRangeSlider
    :values="sliderValues"
    :min="min"
    :max="max"
    :step="step"
    @update="updateLightness"
  />
</template>

<script>
import BaseRangeSlider from "./BaseRangeSlider.vue";
import { useSchemeStore } from "../../../stores/Scheme";

export default {
  name: "WhiteLightnessRangeSlider",
  components: {
    BaseRangeSlider,
  },
  setup() {
    const schemeStore = useSchemeStore();
    return { schemeStore };
  },
  computed: {
    sliderValues() {
      return [
        this.schemeStore.scheme.normalWhiteLightness * 2.56,
        this.schemeStore.scheme.brightWhiteLightness * 2.56,
      ];
    },
    min() {
      return 128;
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
      this.schemeStore.scheme.normalWhiteLightness = values[0] / 2.56;
      this.schemeStore.scheme.brightWhiteLightness = values[1] / 2.56;
      this.schemeStore.recalculateColors();
    },
  },
};
</script>
