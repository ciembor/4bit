<template>
  <section id="advanced" class="ui-tabs ui-widget ui-widget-content ui-corner-all">
    <h2>Advanced</h2>
    <ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">
      <li
        v-for="tab in tabs"
        :key="tab.id"
        :class="tabClasses(tab.id)"
        role="presentation"
        @mouseenter="hoveredTab = tab.id"
        @mouseleave="clearHoveredTab(tab.id)"
      >
        <a
          :aria-selected="String(activeTab === tab.id)"
          :href="`#${tab.id}`"
          role="tab"
          @click.prevent="activeTab = tab.id"
        >
          {{ tab.label }}
        </a>
      </li>
    </ul>

    <div id="dye" :class="panelClasses('dye')" role="tabpanel">
      <LegacyColorPicker
        :format="'hsla'"
        :model-value="dyeColorValue"
        :size="90"
        @color-change="updateDyeColor"
      />
      <AdvancedOptionGroup
        id="dye-radio"
        :model-value="dyeScope"
        name="dye"
        :options="dyeOptions"
        @update:model-value="updateDyeScope"
      />
    </div>

    <div id="background" :class="panelClasses('background')" role="tabpanel">
      <LegacyColorPicker
        :format="'hsl'"
        :model-value="backgroundColorValue"
        :size="90"
        :suppress-alpha-handle="true"
        @color-change="updateBackgroundColor"
      />
      <AdvancedOptionGroup
        id="background-radio"
        :model-value="backgroundMode"
        name="background"
        :options="backgroundOptions"
        @update:model-value="updateBackgroundMode"
      />
    </div>

    <div id="foreground" :class="panelClasses('foreground')" role="tabpanel">
      <LegacyColorPicker
        :format="'hsl'"
        :model-value="foregroundColorValue"
        :size="90"
        :suppress-alpha-handle="true"
        @color-change="updateForegroundColor"
      />
      <AdvancedOptionGroup
        :model-value="foregroundMode"
        name="foreground"
        :options="foregroundOptions"
        @update:model-value="updateForegroundMode"
      />
    </div>
  </section>
</template>

<script>
import { useSchemeStore } from '../../stores/Scheme';
import AdvancedOptionGroup from './advanced/AdvancedOptionGroup.vue';
import LegacyColorPicker from './advanced/LegacyColorPicker.vue';

const DYE_OPTIONS = [
  { value: 'none', label: 'none' },
  { value: 'all', label: 'all' },
  { value: 'achromatic', label: 'achromatic' },
  { value: 'color', label: 'color' },
];

const SPECIAL_COLOR_OPTIONS = [
  { value: 'custom', label: 'custom' },
  { value: 'black', label: 'black' },
  { value: 'bright_black', label: 'bright_black' },
  { value: 'white', label: 'white' },
  { value: 'bright_white', label: 'bright_white' },
];

const LEGACY_ADVANCED_DEFAULTS = {
  dyeScope: 'none',
  dyeColor: {
    hue: 180,
    saturation: 50,
    lightness: 50,
    alpha: 0.25,
  },
  background: 'black',
  customBackgroundColor: {
    hue: 180,
    saturation: 50,
    lightness: 10,
  },
  foreground: 'white',
  customForegroundColor: {
    hue: 180,
    saturation: 50,
    lightness: 90,
  },
};

function normalizeLegacyUiValue(value) {
  switch (value) {
    case 'chromatic':
      return 'color';
    case 'brightBlack':
      return 'bright_black';
    case 'brightWhite':
      return 'bright_white';
    default:
      return value;
  }
}

function hslString(color) {
  return `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
}

function hslaString(color) {
  return `hsla(${color.hue}, ${color.saturation}%, ${color.lightness}%, ${color.alpha})`;
}

export default {
  name: 'AdvancedControls',
  components: {
    AdvancedOptionGroup,
    LegacyColorPicker,
  },
  setup() {
    const schemeStore = useSchemeStore();

    return { schemeStore };
  },
  created() {
    this.applyLegacyAdvancedDefaults();
  },
  data() {
    return {
      activeTab: 'dye',
      hoveredTab: null,
      tabs: [
        { id: 'dye', label: 'Dye' },
        { id: 'background', label: 'Background' },
        { id: 'foreground', label: 'Foreground' },
      ],
      dyeOptions: DYE_OPTIONS,
      backgroundOptions: SPECIAL_COLOR_OPTIONS,
      foregroundOptions: SPECIAL_COLOR_OPTIONS,
    };
  },
  computed: {
    dyeScope() {
      return normalizeLegacyUiValue(this.schemeStore.scheme.dyeScope);
    },
    dyeColorValue() {
      return hslaString(this.schemeStore.scheme.dyeColor);
    },
    backgroundMode() {
      return normalizeLegacyUiValue(this.schemeStore.scheme.background);
    },
    backgroundColorValue() {
      return hslString(this.schemeStore.scheme.customBackgroundColor);
    },
    foregroundMode() {
      return normalizeLegacyUiValue(this.schemeStore.scheme.foreground);
    },
    foregroundColorValue() {
      return hslString(this.schemeStore.scheme.customForegroundColor);
    },
  },
  methods: {
    panelClasses(id) {
      return [
        'ui-tabs-panel',
        'ui-widget-content',
        'ui-corner-bottom',
        { 'ui-tabs-hide': this.activeTab !== id },
      ];
    },
    tabClasses(id) {
      return [
        'ui-state-default',
        'ui-corner-top',
        ...(this.hoveredTab === id ? ['ui-state-hover'] : []),
        ...(this.activeTab === id ? ['ui-tabs-selected', 'ui-state-active'] : []),
      ];
    },
    clearHoveredTab(id) {
      if (this.hoveredTab === id) {
        this.hoveredTab = null;
      }
    },
    applyLegacyAdvancedDefaults() {
      this.schemeStore.scheme.dyeScope = LEGACY_ADVANCED_DEFAULTS.dyeScope;
      this.schemeStore.scheme.dyeColor = { ...LEGACY_ADVANCED_DEFAULTS.dyeColor };
      this.schemeStore.scheme.background = LEGACY_ADVANCED_DEFAULTS.background;
      this.schemeStore.scheme.customBackgroundColor = {
        ...LEGACY_ADVANCED_DEFAULTS.customBackgroundColor,
      };
      this.schemeStore.scheme.foreground = LEGACY_ADVANCED_DEFAULTS.foreground;
      this.schemeStore.scheme.customForegroundColor = {
        ...LEGACY_ADVANCED_DEFAULTS.customForegroundColor,
      };
    },
    updateDyeColor({ hue, saturation, lightness, alpha }) {
      this.schemeStore.scheme.dyeColor = {
        hue,
        saturation,
        lightness,
        alpha,
      };
    },
    updateDyeScope(mode) {
      this.schemeStore.scheme.dyeScope = mode;
    },
    updateBackgroundColor({ hue, saturation, lightness }) {
      this.schemeStore.scheme.customBackgroundColor = {
        hue,
        saturation,
        lightness,
      };
    },
    updateBackgroundMode(mode) {
      this.schemeStore.scheme.background = mode;
    },
    updateForegroundColor({ hue, saturation, lightness }) {
      this.schemeStore.scheme.customForegroundColor = {
        hue,
        saturation,
        lightness,
      };
    },
    updateForegroundMode(mode) {
      this.schemeStore.scheme.foreground = mode;
    },
  },
};
</script>

<style lang="less" scoped>
#advanced {
  font-size: 18px;
  font-family: Rationale, sans-serif;
  border: none;
  background: none;
  padding: 0 !important;

  h2 {
    margin-bottom: 10px;
  }

  a {
    color: #000 !important;
    font-weight: normal;
    padding: 2px 16px 3px;
  }

  > .ui-tabs-nav > .ui-state-active {
    background: #c9c9c9 !important;
  }

  > .ui-tabs-panel.ui-widget-content {
    background: #c9c9c9 !important;
  }

  > .ui-tabs-nav {
    margin-top: 10px;
    padding: 0 !important;
    border: none;
    background: #eee;
    border-radius: 0;
  }

  > .ui-tabs-panel {
    padding: 18px 18px 15px 17px;
    min-height: 0 !important;
    border: 1px solid #999;
    -moz-border-radius-top-right: 6px;
    border-top-right-radius: 6px;
  }
}
</style>
