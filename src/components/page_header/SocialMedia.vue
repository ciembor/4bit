<template>
  <div id="social-media" class="skew">
    <div class="inner">
      <div ref="buttons" class="buttons">
        <a
          :href="shareHref"
          aria-label="post on x"
          class="buttons__overlay"
          rel="noopener noreferrer"
          target="_blank"
        ></a>
      </div>
    </div>
  </div>
</template>

<script>
import { useSchemeStore } from '../../stores/Scheme';
import {
  buildShareUrl,
  buildTwitterShareHref,
  defaultShareBaseUrl,
} from '../../services/SocialShare';

const WIDGET_RETRY_MS = 500;

export default {
  name: 'SocialMedia',
  setup() {
    const schemeStore = useSchemeStore();

    return { schemeStore };
  },
  data() {
    return {
      retryTimerId: null,
    };
  },
  computed: {
    shareUrl() {
      return buildShareUrl(
        this.schemeStore.scheme,
        typeof window !== 'undefined' ? window.location : null
      );
    },
    shareHref() {
      return buildTwitterShareHref(
        this.schemeStore.scheme,
        typeof window !== 'undefined' ? window.location : null
      );
    },
  },
  mounted() {
    this.renderShareButton();
  },
  beforeUnmount() {
    window.clearTimeout(this.retryTimerId);
  },
  methods: {
    renderShareButton() {
      const buttonContainer = this.$refs.buttons;

      if (!buttonContainer) {
        return;
      }

      if (!window.twttr?.widgets?.createShareButton) {
        window.clearTimeout(this.retryTimerId);
        this.retryTimerId = window.setTimeout(() => {
          this.renderShareButton();
        }, WIDGET_RETRY_MS);
        return;
      }

      window.clearTimeout(this.retryTimerId);
      window.twttr.widgets.createShareButton(defaultShareBaseUrl(), buttonContainer, {
        count: 'none',
        via: 'ciembor',
      });
    },
  },
};
</script>

<style lang="less" scoped>
#social-media {
  border: 1px solid #AAA;
  background-color: #C9C9C9;
  position: relative;
  width: 104px;
  display: inline-block;
  white-space: nowrap;

  .buttons {
    display: inline-block;
    min-width: 73px;
    min-height: 20px;
    position: relative;
  }

  .buttons__overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
  }

  .inner {
    position: absolute;
    top: 7px;
    left: 15px;
    display: block;
    width: 73px;
    height: 20px;
  }
}
</style>
