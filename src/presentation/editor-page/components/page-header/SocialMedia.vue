<template>
  <div id="social-media" class="skew">
    <div class="inner">
      <div class="buttons">
        <a
          :href="xShareHref"
          aria-label="share on x"
          class="share-button share-button--x"
          rel="noopener noreferrer"
          target="_blank"
        >X</a>
        <a
          :href="linkedInShareHref"
          aria-label="share on linkedin"
          class="share-button share-button--linkedin"
          rel="noopener noreferrer"
          target="_blank"
        >in</a>
        <a
          :href="facebookShareHref"
          aria-label="share on facebook"
          class="share-button share-button--facebook"
          rel="noopener noreferrer"
          target="_blank"
        >f</a>
      </div>
    </div>
  </div>
</template>

<script>
import { useSchemeStore } from '../../../shared/stores/scheme';
import { useCalculatedSchemeStore } from '../../../shared/stores/calculated-scheme';
import {
  buildFacebookShareHref,
  buildLinkedInShareHref,
  buildTwitterShareHref,
} from '../../../../infrastructure/url/share-urls';

export default {
  name: 'SocialMedia',
  setup() {
    const schemeStore = useSchemeStore();
    const calculatedSchemeStore = useCalculatedSchemeStore();

    return { calculatedSchemeStore, schemeStore };
  },
  computed: {
    currentLocation() {
      return typeof window !== 'undefined' ? window.location : null;
    },
    xShareHref() {
      return buildTwitterShareHref({
        scheme: this.schemeStore.scheme,
        colors: this.calculatedSchemeStore.calculatedScheme,
        location: this.currentLocation,
      });
    },
    linkedInShareHref() {
      return buildLinkedInShareHref({
        scheme: this.schemeStore.scheme,
        colors: this.calculatedSchemeStore.calculatedScheme,
        location: this.currentLocation,
      });
    },
    facebookShareHref() {
      return buildFacebookShareHref({
        scheme: this.schemeStore.scheme,
        colors: this.calculatedSchemeStore.calculatedScheme,
        location: this.currentLocation,
      });
    },
  },
};
</script>
