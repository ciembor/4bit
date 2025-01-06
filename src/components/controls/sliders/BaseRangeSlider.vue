<template>
  <div>
    <div ref="slider"></div>
  </div>
</template>

<script>
export default {
  name: "BaseRangeSlider",
  props: {
    values: {
      type: Array,
      required: true,
      validator: (val) => Array.isArray(val) && val.length === 2 && val.every((v) => typeof v === "number"),
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    step: {
      type: Number,
      default: 1,
    },
  },
  emits: ["update"],
  mounted() {
    window.$(this.$refs.slider).slider({
      range: true,
      values: this.values,
      min: this.min,
      max: this.max,
      step: this.step,
      slide: (event, ui) => {
        this.$emit("update", ui.values);
      },
    });
  },
  watch: {
    values(newValues) {
      window.$(this.$refs.slider).slider("values", newValues);
    },
  },
};
</script>

<style>
.ui-slider {
  font-size: 12px;
}

.ui-slider-handle {
  outline: 0 !important;
  cursor: pointer !important;
}
</style>
