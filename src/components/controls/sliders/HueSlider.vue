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
import {
  hueCycleForHueSet,
  normalizeHueForHueSet,
} from "../../../services/HueSetPresets";

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
      return hueCycleForHueSet(this.schemeStore.scheme.hueSet);
    },
    sliderValue() {
      const rawHue = Number(this.schemeStore.scheme.hue);
      const min = this.min;
      const max = this.max;

      if (Number.isFinite(rawHue) && rawHue >= min && rawHue <= max) {
        return rawHue;
      }

      return normalizeHueForHueSet(rawHue, this.schemeStore.scheme.hueSet);
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
      this.schemeStore.scheme.hue = sliderValue;
    },
  },
};
</script>
