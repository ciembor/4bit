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
  name: "BlackLightnessRangeSlider",
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
        this.schemeStore.scheme.normalBlackLightness * 2.56,
        this.schemeStore.scheme.brightBlackLightness * 2.56,
      ];
    },
    min() {
      return 0;
    },
    max() {
      return 128;
    },
    step() {
      return 1;
    },
  },
  methods: {
    updateLightness(values) {
      this.schemeStore.scheme.normalBlackLightness = values[0] / 2.56;
      this.schemeStore.scheme.brightBlackLightness = values[1]  / 2.56;
    },
  },
};
</script>
