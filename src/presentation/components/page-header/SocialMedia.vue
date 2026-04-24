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
import { useSchemeStore } from '../../stores/scheme';
import {
  buildFacebookShareHref,
  buildLinkedInShareHref,
  buildTwitterShareHref,
} from '../../../infrastructure/serialization/share-urls';

export default {
  name: 'SocialMedia',
  setup() {
    const schemeStore = useSchemeStore();

    return { schemeStore };
  },
  computed: {
    currentLocation() {
      return typeof window !== 'undefined' ? window.location : null;
    },
    xShareHref() {
      return buildTwitterShareHref(
        this.schemeStore.scheme,
        this.currentLocation
      );
    },
    linkedInShareHref() {
      return buildLinkedInShareHref(
        this.schemeStore.scheme,
        this.currentLocation
      );
    },
    facebookShareHref() {
      return buildFacebookShareHref(
        this.schemeStore.scheme,
        this.currentLocation
      );
    },
  },
};
</script>

<style lang="less" scoped>
#social-media {
  border: 1px solid #AAA;
  background-color: #C9C9C9;
  position: relative;
  width: 180px;
  display: inline-block;
  white-space: nowrap;

  .buttons {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .inner {
    position: absolute;
    top: 7px;
    left: 14px;
  }
}

.share-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 18px;
  border: 1px solid #999;
  border-radius: 999px;
  color: #fff;
  font-family: Arial, Verdana, sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: bold;
  line-height: 1;
  text-decoration: none;
  text-transform: none;
}

.share-button--x {
  background: #111;
}

.share-button--linkedin {
  background: #0a66c2;
}

.share-button--facebook {
  background: #1877f2;
}
</style>
