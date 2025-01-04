<template>
  <BaseSlider
    :value="sliderValue"
    :min="min"
    :max="max"
    :step="step"
    @update="updateSaturation"
  />
</template>

<script>
import BaseSlider from "./BaseSlider.vue";
import { useSchemeStore } from "../../../stores/Scheme";

export default {
  name: "SaturationSlider",
  components: {
    BaseSlider,
  },
  setup() {
    const schemeStore = useSchemeStore();
    return { schemeStore };
  },
  computed: {
    sliderValue() {
      return this.schemeStore.scheme.saturation;
    },
    min() {
      return 0;
    },
    max() {
      return 100;
    },
    step() {
      return 1;
    },
  },
  methods: {
    updateSaturation(sliderValue) {
      const newSaturation = sliderValue;
      this.schemeStore.scheme.saturation = newSaturation;
      this.schemeStore.recalculateColors();
    },
  },
};
</script>
