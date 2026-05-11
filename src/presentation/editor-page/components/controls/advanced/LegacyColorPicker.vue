<template>
  <div
    ref="root"
    :class="[
      'legacy-color-picker',
      { 'legacy-color-picker--muted-alpha': suppressAlphaHandle },
    ]"
    :style="{ '--legacy-color-picker-size': `${size}px` }"
  >
    <input ref="input" type="text" />
  </div>
</template>

<script>
import jQuery from 'jquery';

export default {
  name: 'LegacyColorPicker',
  props: {
    format: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 90,
    },
    suppressAlphaHandle: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['color-change', 'update:modelValue'],
  mounted() {
    this.picker = jQuery(this.$refs.input);
    this.picker.colorPicker({
      format: this.format,
      size: this.size,
      colorChange: (event, ui) => {
        this.$emit('update:modelValue', ui.color);
        this.$emit('color-change', ui);
      },
    });

    this.syncColor(this.modelValue, true);
    this.syncLegacyAlphaHandle();
  },
  beforeUnmount() {
    if (this.picker) {
      this.picker.colorPicker('destroy');
      this.picker = null;
    }
  },
  watch: {
    format(newFormat) {
      if (!this.picker) {
        return;
      }

      this.picker.colorPicker('option', 'format', newFormat);
      this.syncColor(this.modelValue, true);
      this.syncLegacyAlphaHandle();
    },
    modelValue(newValue) {
      this.syncColor(newValue);
    },
    suppressAlphaHandle() {
      this.syncLegacyAlphaHandle();
    },
  },
  methods: {
    syncColor(value, force = false) {
      if (!this.picker || !value || (!force && this.picker.val() === value)) {
        return;
      }

      this.picker.colorPicker('setColor', value);
      this.syncLegacyAlphaHandle();
    },
    syncLegacyAlphaHandle() {
      window.requestAnimationFrame(() => {
        const alphaHandle = jQuery(this.$refs.root).find('.alpha .ui-draggable');

        if (this.suppressAlphaHandle) {
          alphaHandle.removeClass('ui-draggable handle');
        } else {
          alphaHandle.addClass('ui-draggable handle');
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.legacy-color-picker {
  display: inline-block;

  :deep(.colorInput) {
    display: none;
  }

  :deep(.colorpicker) {
    display: inline-block;
    height: var(--legacy-color-picker-size);
  }
}

.legacy-color-picker--muted-alpha {
  :deep(.alpha) {
    opacity: 0.3;
  }
}
</style>
