<template>
  <section id="skews">
    <slot name="social-media"></slot>
    <AboutButton :href="primaryButtonHref" :label="primaryButtonLabel" />
    <slot name="download-button"></slot>
  </section>
</template>

<script>
import AboutButton from './AboutButton.vue';

export default {
  name: 'MainMenu',
  components: {
    AboutButton,
  },
  props: {
    primaryButtonHref: {
      type: String,
      default: () => `${import.meta.env.BASE_URL}about/`,
    },
    primaryButtonLabel: {
      type: String,
      default: 'About',
    },
  },
};
</script>
