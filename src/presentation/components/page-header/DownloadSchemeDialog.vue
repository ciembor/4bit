<template>
  <Teleport to="body">
    <div v-if="open" class="download-scheme-modal">
      <div class="download-scheme-overlay" @click="closeDialog"></div>
      <div
        class="download-scheme-dialog ui-dialog ui-widget ui-widget-content ui-corner-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-scheme-title"
        :style="dialogStyle"
      >
        <div class="ui-dialog-titlebar ui-widget-header ui-corner-all">
          <span id="download-scheme-title" class="ui-dialog-title">
            Export scheme to the configuration file
          </span>
          <button
            type="button"
            class="ui-dialog-titlebar-close ui-corner-all"
            aria-label="Close"
            @click="closeDialog"
          >
            <span class="ui-icon ui-icon-closethick" aria-hidden="true"></span>
          </button>
        </div>
        <div class="ui-dialog-content ui-widget-content">
          <ul>
            <li v-for="format in formats" :key="format.id">
              <p>
                {{ format.text }}
                <a
                  :id="format.buttonId"
                  class="get-scheme-link"
                  href="#"
                  :class="{ disabled: !canDownload }"
                  :aria-disabled="String(!canDownload)"
                  @click.prevent="downloadScheme(format)"
                >
                  {{ format.linkLabel }}
                </a>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { useCalculatedSchemeStore } from '../../stores/calculated-scheme';
import {
  buildSchemeDownload,
  canExportScheme,
  SCHEME_DOWNLOADS,
} from '../../../infrastructure/serialization/scheme-exporters';

export default {
  name: 'DownloadSchemeDialog',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  setup() {
    const calculatedSchemeStore = useCalculatedSchemeStore();
    return { calculatedSchemeStore };
  },
  computed: {
    formats() {
      return SCHEME_DOWNLOADS;
    },
    canDownload() {
      return canExportScheme(this.calculatedSchemeStore.calculatedScheme);
    },
    dialogStyle() {
      return {
        width: '450px',
      };
    },
  },
  watch: {
    open: {
      immediate: true,
      handler(isOpen) {
        if (typeof document === 'undefined') {
          return;
        }

        document.body.style.overflow = isOpen ? 'hidden' : '';
      },
    },
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    document.body.style.overflow = '';
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    handleKeydown(event) {
      if (this.open && event.key === 'Escape') {
        this.closeDialog();
      }
    },
    downloadScheme(format) {
      if (!this.canDownload) {
        return;
      }

      const blob = buildSchemeDownload(
        format.id,
        this.calculatedSchemeStore.calculatedScheme
      );
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = blobUrl;
      link.download = format.downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 0);
    },
  },
};
</script>

<style lang="less" scoped>
.download-scheme-modal {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.download-scheme-overlay {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 80%);
}

.download-scheme-dialog {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 32px);
  font-family: Rationale, sans-serif;
  background: #c9c9c9 !important;

  & > .ui-widget-header {
    padding-left: 15px;
    font-size: 26px;
    font-weight: normal;
    color: #000;
    background: #eee !important;
    border-radius: 6px;
  }

  & > .ui-widget-content {
    overflow: auto;
    background: #c9c9c9 !important;
    height: auto !important;
    padding: 1em 0.8em 0.8em;
  }

  .ui-dialog-titlebar-close {
    cursor: pointer;
    border: 1px solid #ccc;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 21px;
    height: 20px;
    padding: 1px;
    background: #eee url('/images/ui-bg_glass_60_eeeeee_1x400.png') 50% 50% repeat-x;
  }

  .ui-dialog-titlebar-close .ui-icon-closethick {
    width: 11px;
    height: 11px;
    margin: 0;
    background: url('/images/cross.png') center center no-repeat !important;
  }

  .ui-dialog-titlebar-close:hover,
  .ui-dialog-titlebar-close:focus {
    border: 1px solid #bbb;
    padding: 1px;
    background: #f8f8f8 url('/images/ui-bg_glass_100_f8f8f8_1x400.png') 50% 50% repeat-x;
  }

  .ui-dialog-titlebar-close:active {
    border: 1px solid #999;
    padding: 1px;
    background: #999 url('/images/ui-bg_inset-hard_75_999999_1x100.png') 50% 50% repeat-x;
  }

  .ui-dialog-titlebar-close:hover .ui-icon-closethick,
  .ui-dialog-titlebar-close:focus .ui-icon-closethick {
    background: url('/images/cross_active.png') center center no-repeat !important;
  }

  ul {
    background-color: #eee;
    border-radius: 6px;

    li {
      padding: 10px 0;

      p {
        font-size: 22px;
        position: relative;
        line-height: 30px;
        padding: 0 10px;

        a {
          line-height: 1em;
          font-size: 18px;
        }
      }
    }

    li:nth-child(even) {
      background-color: #ddd;
    }

    li:last-child {
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }
}

.get-scheme-link {
  display: inline-block;
  float: right;
  padding: 5px 10px;
  border: 1px solid #bbb;
  border-radius: 6px;
  color: inherit;
  background: rgb(254 254 254);
  background: linear-gradient(to bottom, rgb(254 254 254 / 100%) 0%, rgb(223 223 223 / 100%) 100%);

  &:hover {
    border: 1px solid #aaa;
    background: rgb(247 247 247);
    background: linear-gradient(to bottom, rgb(247 247 247 / 100%) 0%, rgb(224 224 224 / 100%) 76%, rgb(218 218 218 / 100%) 88%, rgb(209 209 209 / 100%) 100%);
  }

  &:active {
    border: 1px solid #aaa;
    background: rgb(225 225 225);
    background: linear-gradient(to bottom, rgb(225 225 225 / 100%) 0%, rgb(218 218 218 / 100%) 100%);
  }

  &.disabled {
    opacity: 0.35;
    pointer-events: none;
  }
}
</style>
