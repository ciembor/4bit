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
import { useSchemeStore } from "../../../stores/Scheme";

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
    sliderValue() {
      return this.schemeStore.scheme.hue + 30;
    },
    min() {
      return 0;
    },
    max() {
      return 60;
    },
    step() {
      return 1;
    },
  },
  methods: {
    updateHue(sliderValue) {
      const newHue = sliderValue - 30;
      this.schemeStore.scheme.hue = newHue;
    },
  },
};
</script>
