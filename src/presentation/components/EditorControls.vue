<template>
  <section id="controls">
    <section id="global-properties">
      <div class="section-heading">
        <h2>Global Properties</h2>
        <button type="button" class="defaults-button" @click="resetDefaults">defaults</button>
      </div>
      <h3>Hue: </h3>
      <HueSlider />
			<h3>Saturation:</h3>
			<SaturationSlider />
    </section>
    <section id="lightness">
      <h2>Lightness</h2>
      <h3>Color:</h3>
      <ColorLightnessSlider />
      <h3>Black:</h3>
      <BlackLightnessSlider />
      <h3>White:</h3>
      <WhiteLightnessSlider />
    </section>
    <AdvancedControls />
  </section>
</template>

<script>
import { useSchemeStore } from '../stores/scheme';
import HueSlider from './controls/sliders/HueSlider.vue';
import SaturationSlider from './controls/sliders/SaturationSlider.vue';
import ColorLightnessSlider from './controls/sliders/ColorLightnessSlider.vue';
import BlackLightnessSlider from './controls/sliders/BlackLightnessSlider.vue';
import WhiteLightnessSlider from './controls/sliders/WhiteLightnessSlider.vue';
import AdvancedControls from './controls/AdvancedControls.vue';

export default {
  name: 'EditorControls',
  components: {   
    HueSlider,
		SaturationSlider,
		ColorLightnessSlider,
		BlackLightnessSlider,
		WhiteLightnessSlider,
    AdvancedControls
  },
  setup() {
    const schemeStore = useSchemeStore();

    return { schemeStore };
  },
  methods: {
    resetDefaults() {
      this.schemeStore.resetScheme();
    },
  },
};
</script>

<style lang="less" scoped>
#controls {
  vertical-align: top;
  display: inline-block;
  margin-left: 19px;
  width: 300px;

  h2 {
    font-size: 26px;
    margin: 20px 0 5px;
  }

  h3 {
    font-size: 18px;
    margin: 10px 0 5px;
  }

  .section-heading {
    align-items: center;
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .defaults-button {
    background: rgb(254 254 254);
    background: linear-gradient(
      to bottom,
      rgb(254 254 254 / 100%) 0%,
      rgb(223 223 223 / 100%) 100%
    );
    border: 1px solid #ccc;
    border-radius: 6px;
    cursor: pointer;
    font-family: Arial, Verdana, sans-serif;
    font-size: 12px;
    font-weight: normal;
    line-height: 1.2;
    margin-top: 15px;
    padding: 3px 8px 2px;
    white-space: nowrap;
  }

  .defaults-button:hover {
    background: rgb(247 247 247);
    background: linear-gradient(
      to bottom,
      rgb(247 247 247 / 100%) 0%,
      rgb(224 224 224 / 100%) 76%,
      rgb(218 218 218 / 100%) 88%,
      rgb(209 209 209 / 100%) 100%
    );
    border: 1px solid #bbb;
  }

  .defaults-button:active {
    background: rgb(225 225 225);
    background: linear-gradient(
      to bottom,
      rgb(225 225 225 / 100%) 0%,
      rgb(218 218 218 / 100%) 100%
    );
    border: 1px solid #bbb;
  }
}
</style>
