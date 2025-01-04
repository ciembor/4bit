<template>
  <section id="controls">
    <section id="global-properties">
      <h2>Global Properties</h2>
      <h3>Hue: </h3>
      <HueSlider />
			<h3>Saturation:</h3>
			<SaturationSlider />
    </section>
  </section>
</template>

<script>
import HueSlider from './controls/sliders/HueSlider.vue';
import SaturationSlider from './controls/sliders/SaturationSlider.vue';

export default {
  name: 'EditorControls',
  components: {   
    HueSlider,
		SaturationSlider
  },
};
</script>

<style lang="less">
#controls {
	vertical-align: top;
	// visibility: hidden;
	display: inline-block;
	margin-left: 16px;
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