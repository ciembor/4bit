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
          <div class="hue-set-sliders__title">Deviation:</div>
          <div class="hue-set-slider">
            <label class="hue-set-slider__label">H</label>
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
          <div class="hue-set-slider">
            <label class="hue-set-slider__label">S</label>
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
            <label class="hue-set-slider__label">L</label>
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
        </div>
        <AdvancedOptionGroup
          id="hue-set-radio"
          :model-value="colorMode"
          name="hue-set"
          :options="colorModeOptions"
          @update:model-value="updateColorMode"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { useSchemeStore } from '../../stores/scheme';
import AdvancedOptionGroup from './advanced/AdvancedOptionGroup.vue';
import LegacyColorPicker from './advanced/LegacyColorPicker.vue';
import BaseSlider from './sliders/BaseSlider.vue';
import {
  DEFAULT_HUE_DISTANCE,
  degreesForColorMode,
  HUE_DISTANCE_MAX,
  HUE_DISTANCE_MIN,
  inferColorModeFromDegrees,
  isColorModeValue,
  normalizeColorModeValue,
} from '../../../domain/scheme/color-mode';
import {
  DEFAULT_LIGHTNESS_RANGE,
  DEFAULT_SATURATION_RANGE,
  LIGHTNESS_RANGE_MAX,
  SATURATION_RANGE_MAX,
} from '../../../domain/scheme/scheme-state';

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

const COLOR_MODE_OPTIONS = [
  { value: 'monochrome', label: 'monochrome' },
  { value: 'duotone', label: 'duotone' },
  { value: 'tricolor', label: 'tricolor' },
  { value: 'hexachrome', label: 'hexachrome' },
];

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
    BaseSlider,
    LegacyColorPicker,
  },
  setup() {
    const schemeStore = useSchemeStore();

    return { schemeStore };
  },
  data() {
    return {
      activeTab: 'dye',
      hoveredTab: null,
      tabs: [
        { id: 'dye', label: 'Dye' },
        { id: 'background', label: 'Bg' },
        { id: 'foreground', label: 'Fg' },
        { id: 'hue-set', label: 'Color Mode' },
      ],
      dyeOptions: DYE_OPTIONS,
      backgroundOptions: SPECIAL_COLOR_OPTIONS,
      foregroundOptions: SPECIAL_COLOR_OPTIONS,
      colorModeOptions: COLOR_MODE_OPTIONS,
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
    colorMode() {
      const storedColorMode = normalizeColorModeValue(this.schemeStore.scheme.colorMode);
      const inferredColorMode = inferColorModeFromDegrees(
        this.schemeStore.scheme.degrees,
        this.hueDistance
      );

      if (
        isColorModeValue(storedColorMode) &&
        degreesForColorMode(storedColorMode, this.hueDistance)?.every((degree, index) =>
          degree === this.schemeStore.scheme.degrees[index]
        )
      ) {
        return storedColorMode;
      }

      if (inferredColorMode) {
        return inferredColorMode;
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
    updateDyeColor({ hue, saturation, lightness, alpha }) {
      this.schemeStore.setDyeColor({
        hue,
        saturation,
        lightness,
        alpha,
      });
    },
    updateDyeScope(mode) {
      this.schemeStore.setDyeScope(mode);
    },
    updateBackgroundColor({ hue, saturation, lightness }) {
      this.schemeStore.setBackgroundColor({
        hue,
        saturation,
        lightness,
      });
    },
    updateBackgroundMode(mode) {
      this.schemeStore.setBackgroundMode(mode);
    },
    updateForegroundColor({ hue, saturation, lightness }) {
      this.schemeStore.setForegroundColor({
        hue,
        saturation,
        lightness,
      });
    },
    updateForegroundMode(mode) {
      this.schemeStore.setForegroundMode(mode);
    },
    updateColorMode(mode) {
      this.schemeStore.setColorMode(mode);
    },
    updateHueDistance(distance) {
      this.schemeStore.setHueDistance(distance);
    },
    updateSaturationRange(range) {
      this.schemeStore.setSaturationRange(range);
    },
    updateLightnessRange(range) {
      this.schemeStore.setLightnessRange(range);
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
