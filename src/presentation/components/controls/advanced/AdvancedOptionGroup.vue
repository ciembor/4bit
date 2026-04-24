<template>
  <form :id="id" :class="groupClasses()" class="radio-group">
    <div v-for="(option, index) in options" :key="option.value" class="radio-option">
      <input
        :id="optionId(index)"
        :checked="modelValue === option.value"
        :name="name"
        type="radio"
        :value="option.value"
        @change="$emit('update:modelValue', option.value)"
      />
      <label
        :class="labelClasses(index, option.value)"
        :for="optionId(index)"
        @mouseenter="hoveredValue = option.value"
        @mouseleave="clearHoveredValue(option.value)"
      >
        <span class="ui-button-text">{{ option.label }}</span>
      </label>
    </div>
  </form>
</template>

<script>
export default {
  name: 'AdvancedOptionGroup',
  props: {
    id: {
      type: String,
      default: null,
    },
    modelValue: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      hoveredValue: null,
    };
  },
  methods: {
    optionId(index) {
      return `${this.name}-${index + 1}`;
    },
    groupClasses() {
      return {
        'radio-group--four-options': ['dye-radio', 'hue-set-radio'].includes(this.id),
        'radio-group--hue-set': this.id === 'hue-set-radio',
      };
    },
    labelClasses(index, value) {
      const classes = ['ui-button', 'ui-widget', 'ui-state-default', 'ui-button-text-only'];

      if (index === 0) {
        classes.push('ui-corner-top');
      }

      if (index === this.options.length - 1) {
        classes.push('ui-corner-bottom');
      }

      if (this.modelValue === value) {
        classes.push('ui-state-active');
      }

      if (this.hoveredValue === value) {
        classes.push('ui-state-hover');
      }

      return classes;
    },
    clearHoveredValue(value) {
      if (this.hoveredValue === value) {
        this.hoveredValue = null;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.radio-group {
  display: inline-block;
  vertical-align: top;
  margin: -1px 0 0 18px !important;

  input {
    display: none;
  }

  br {
    display: none;
  }
}

.radio-group > .radio-option {
  margin: 1px;
}

.radio-group label {
  display: block;
  height: 18px;
  width: 115px;
  margin: -2px 0 0;
  padding: 0;
  border: 1px solid #999 !important;

  .ui-button-text {
    font-family: Arial, Verdana, sans-serif;
    margin: 1px 0 0;
    font-size: 12px;
    color: #000;
    font-weight: normal;
    padding: 0 !important;
  }
}

.radio-group label.ui-button,
.radio-group label.ui-button .ui-button-text {
  cursor: pointer;
}

.radio-group--four-options label {
  height: 23px !important;
  margin-bottom: -1px;

  .ui-button-text {
    margin: 3px 0 0;
  }
}

.radio-group--hue-set {
  margin: 0 0 0 18px !important;
}
</style>
