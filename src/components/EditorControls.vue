<template>
  <section id="controls">
    <section id="global-properties">
      <h2>Global Properties</h2>
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
};
</script>

<style lang="less">
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
}
</style>
