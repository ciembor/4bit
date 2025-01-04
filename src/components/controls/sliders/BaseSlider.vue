<template>
  <div>
    <div ref="slider"></div>
  </div>
</template>

<script>
export default {
  name: "BaseSlider",
  props: {
    value: {
      type: Number,
      required: true,
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
      value: this.value,
      min: this.min,
      max: this.max,
      step: this.step,
      slide: (event, ui) => {
        this.$emit("update", ui.value);
      },
    });
  },
  watch: {
    value(newValue) {
      window.$(this.$refs.slider).slider("value", newValue);
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
