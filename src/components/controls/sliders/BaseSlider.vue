<template>
  <div :class="['base-slider', { 'base-slider--disabled': disabled }]">
    <div ref="slider"></div>
  </div>
</template>

<script>
import jQuery from 'jquery';

export default {
  name: 'BaseSlider',
  props: {
    value: {
      type: Number,
      default: null,
    },
    values: {
      type: Array,
      default: null,
      validator: (value) => value === null || (
        Array.isArray(value) &&
        value.length === 2 &&
        value.every((entry) => typeof entry === 'number')
      ),
    },
    range: {
      type: Boolean,
      default: false,
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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update'],
  mounted() {
    this.slider = jQuery(this.$refs.slider);
    this.slider.slider(this.sliderOptions());
  },
  beforeUnmount() {
    if (this.slider) {
      this.slider.slider('destroy');
      this.slider = null;
    }
  },
  watch: {
    range() {
      this.reinitializeSlider();
    },
    value(newValue) {
      if (!this.range && this.slider) {
        this.slider.slider('value', newValue);
      }
    },
    values(newValues) {
      if (this.range && this.slider) {
        this.slider.slider('values', newValues);
      }
    },
    disabled(newValue) {
      if (this.slider) {
        this.slider.slider('option', 'disabled', newValue);
      }
    },
  },
  methods: {
    sliderOptions() {
      return {
        min: this.min,
        max: this.max,
        step: this.step,
        disabled: this.disabled,
        ...(this.range
          ? {
              range: true,
              values: this.values,
            }
          : {
              value: this.value,
            }),
        slide: (event, ui) => {
          this.$emit('update', this.range ? ui.values : ui.value);
        },
      };
    },
    reinitializeSlider() {
      if (!this.slider) {
        return;
      }

      this.slider.slider('destroy');
      this.slider.slider(this.sliderOptions());
    },
  },
};
</script>

<style scoped>
.base-slider :deep(.ui-slider) {
  font-size: 12px;
}

.base-slider :deep(.ui-slider-handle) {
  outline: 0 !important;
  cursor: pointer !important;
}

.base-slider :deep(.ui-slider.ui-state-disabled) {
  opacity: 0.45;
}

.base-slider :deep(.ui-state-disabled .ui-slider-handle) {
  cursor: default !important;
}
</style>
