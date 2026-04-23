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

    <div id="hue-set" :class="panelClasses('hue-set')" role="tabpanel">
      <div class="hue-set-layout">
        <div class="hue-set-sliders">
          <div class="hue-set-sliders__title">Distance:</div>
          <div class="hue-set-slider">
            <label class="hue-set-slider__label">Sat</label>
            <div class="hue-set-slider__control">
              <BaseSlider
                :value="saturationRange"
                :min="0"
                :max="saturationRangeMax"
                :step="1"
                @update="updateSaturationRange"
              />
            </div>
          </div>
          <div class="hue-set-slider">
            <label class="hue-set-slider__label">Col</label>
            <div class="hue-set-slider__control">
              <BaseSlider
                :value="lightnessRange"
                :min="0"
                :max="lightnessRangeMax"
                :step="1"
                @update="updateLightnessRange"
              />
            </div>
          </div>
          <div class="hue-set-slider">
            <label class="hue-set-slider__label">Hue</label>
            <div class="hue-set-slider__control">
              <BaseSlider
                :value="hueDistance"
                :min="hueDistanceMin"
                :max="hueDistanceMax"
                :step="1"
                @update="updateHueDistance"
              />
            </div>
          </div>
        </div>
        <AdvancedOptionGroup
          id="hue-set-radio"
          :model-value="hueSet"
          name="hue-set"
          :options="hueSetOptions"
          @update:model-value="updateHueSet"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { useSchemeStore } from '../../stores/Scheme';
import AdvancedOptionGroup from './advanced/AdvancedOptionGroup.vue';
import LegacyColorPicker from './advanced/LegacyColorPicker.vue';
import BaseSlider from './sliders/BaseSlider.vue';

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

const DEFAULT_HUE_SET = 'standard';
const DEFAULT_HUE_DISTANCE = 0;
const HUE_DISTANCE_MIN = 0;
const HUE_DISTANCE_MAX = 45;
const DEFAULT_SATURATION_RANGE = 0;
const SATURATION_RANGE_MAX = 50;
const DEFAULT_LIGHTNESS_RANGE = 0;
const LIGHTNESS_RANGE_MAX = 30;
const STANDARD_HUE_SET_DEGREES = [0, 60, 120, 180, 240, 300];
const STANDARD_HUE_DISTANCE_WEIGHTS = [0, 1, 0.5, -0.5, -1, -0.25];

const HUE_SET_OPTIONS = [
  { value: 'uno', label: 'Uno' },
  { value: 'duo', label: 'Duo' },
  { value: 'trio', label: 'Trio' },
  { value: 'standard', label: 'Standard' },
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

function normalizeHueDegree(degree) {
  return (degree + 360) % 360;
}

function clampSliderValue(value, min, max, fallback) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.round(numericValue)));
}

function clampHueDistance(distance) {
  return clampSliderValue(
    distance,
    HUE_DISTANCE_MIN,
    HUE_DISTANCE_MAX,
    DEFAULT_HUE_DISTANCE
  );
}

function clampSaturationRange(range) {
  return clampSliderValue(range, 0, SATURATION_RANGE_MAX, DEFAULT_SATURATION_RANGE);
}

function clampLightnessRange(range) {
  return clampSliderValue(range, 0, LIGHTNESS_RANGE_MAX, DEFAULT_LIGHTNESS_RANGE);
}

function offsetStandardHueDegrees(distance) {
  return STANDARD_HUE_SET_DEGREES.map((degree, index) =>
    normalizeHueDegree(degree + Math.round(distance * STANDARD_HUE_DISTANCE_WEIGHTS[index]))
  );
}

function degreesForHueSet(mode, hueDistance = DEFAULT_HUE_DISTANCE) {
  const distance = clampHueDistance(hueDistance);

  switch (mode) {
    case 'uno':
      return [
        0,
        distance,
        Math.round(distance / 2),
        -Math.round(distance / 2),
        -distance,
        -Math.round(distance / 4),
      ].map(normalizeHueDegree);
    case 'duo':
      return [0, distance, 120, 120 + distance, 120 - distance, -distance]
        .map(normalizeHueDegree);
    case 'trio':
      return [0, distance, 120, 120 + distance, 240, 240 + distance]
        .map(normalizeHueDegree);
    case 'standard':
      return offsetStandardHueDegrees(distance);
    default:
      return null;
  }
}

function degreesEqual(first, second) {
  return (
    first.length === second.length &&
    first.every((degree, index) => degree === second[index])
  );
}

export default {
  name: 'AdvancedControls',
  components: {
    AdvancedOptionGroup,
    BaseSlider,
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
        { id: 'background', label: 'Bg' },
        { id: 'foreground', label: 'Fg' },
        { id: 'hue-set', label: 'Hue Set' },
      ],
      dyeOptions: DYE_OPTIONS,
      backgroundOptions: SPECIAL_COLOR_OPTIONS,
      foregroundOptions: SPECIAL_COLOR_OPTIONS,
      hueSetOptions: HUE_SET_OPTIONS,
      hueDistanceMin: HUE_DISTANCE_MIN,
      hueDistanceMax: HUE_DISTANCE_MAX,
      saturationRangeMax: SATURATION_RANGE_MAX,
      lightnessRangeMax: LIGHTNESS_RANGE_MAX,
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
    hueSet() {
      const storedHueSet = this.schemeStore.scheme.hueSet;

      if (HUE_SET_OPTIONS.some((option) => option.value === storedHueSet)) {
        return storedHueSet;
      }

      if (degreesEqual(this.schemeStore.scheme.degrees, STANDARD_HUE_SET_DEGREES)) {
        return DEFAULT_HUE_SET;
      }

      return 'custom';
    },
    hueDistance() {
      return this.schemeStore.scheme.hueDistance ?? DEFAULT_HUE_DISTANCE;
    },
    saturationRange() {
      return this.schemeStore.scheme.saturationRange ?? DEFAULT_SATURATION_RANGE;
    },
    lightnessRange() {
      return this.schemeStore.scheme.lightnessRange ?? DEFAULT_LIGHTNESS_RANGE;
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
    updateHueSet(mode) {
      const degrees = degreesForHueSet(mode, this.hueDistance);

      if (!degrees) {
        return;
      }

      this.schemeStore.scheme.hueSet = mode;
      this.schemeStore.scheme.degrees = degrees;
    },
    updateHueDistance(distance) {
      const nextDistance = clampHueDistance(distance);
      const degrees = degreesForHueSet(this.hueSet, nextDistance);

      this.schemeStore.scheme.hueDistance = nextDistance;

      if (degrees) {
        this.schemeStore.scheme.degrees = degrees;
      }
    },
    updateSaturationRange(range) {
      this.schemeStore.scheme.saturationRange = clampSaturationRange(range);
    },
    updateLightnessRange(range) {
      this.schemeStore.scheme.lightnessRange = clampLightnessRange(range);
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
    font-size: 26px;
    margin: 20px 0 5px;
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

  .hue-set-layout {
    display: flex;
    align-items: flex-start;
  }

  .hue-set-sliders {
    flex: 1 1 auto;
    min-width: 0;
  }

  .hue-set-sliders__title {
    margin: 4px 0 8px;
    color: #333;
    font-family: Arial, Verdana, sans-serif;
    font-size: 12px;
    font-weight: normal;
  }

  .hue-set-slider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 13px;
  }

  .hue-set-slider:first-child {
    margin-top: 0;
  }

  .hue-set-slider__label {
    flex: 0 0 22px;
    color: #333;
    font-family: Arial, Verdana, sans-serif;
    font-size: 12px;
    font-weight: normal;
    line-height: 1;
  }

  .hue-set-slider__control {
    flex: 1 1 auto;
    min-width: 0;
  }
}
</style>
