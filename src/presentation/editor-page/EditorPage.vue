<template>
  <div class="wrapper">
    <header>
      <AppLogo />
      <MainMenu>
        <template #social-media>
          <SocialMedia />
        </template>
        <template #download-button>
          <GetSchemeButton />
        </template>
      </MainMenu>
    </header>
    <div class="distance"></div>
    <div id="editor" class="vertical-center">
      <TerminalDisplay />
      <EditorControls />
    </div>
  </div>
  <PageFooter />
</template>

<script>
import { watch } from 'vue';
import AppLogo from '../shared/components/page-header/AppLogo.vue';
import MainMenu from '../shared/components/page-header/MainMenu.vue';
import GetSchemeButton from './components/page-header/GetSchemeButton.vue';
import SocialMedia from './components/page-header/SocialMedia.vue';
import TerminalDisplay from './components/TerminalDisplay.vue';
import EditorControls from './components/EditorControls.vue';
import PageFooter from '../shared/components/PageFooter.vue';
import CalculatedSchemeSync from './calculated-scheme-sync';
import { SchemeUrlSync } from '../../infrastructure/browser/scheme-url-sync';
import { useCalculatedSchemeStore } from '../shared/stores/calculated-scheme';
import { useSchemeStore } from '../shared/stores/scheme';
import { applyThemeVariables, clearThemeVariables } from '../shared/theme/css-theme-variables';

export default {
  name: 'App',
  components: {
    AppLogo,
    MainMenu,
    GetSchemeButton,
    SocialMedia,
    TerminalDisplay,
    EditorControls,
    PageFooter,
  },
  setup() {
    const calculatedSchemeStore = useCalculatedSchemeStore();
    const schemeStore = useSchemeStore();

    return { calculatedSchemeStore, schemeStore };
  },
  mounted() {
    this.calculatedSchemeSync = new CalculatedSchemeSync();
    this.schemeUrlSync = new SchemeUrlSync({ schemeStore: this.schemeStore });
    this.schemeUrlSync.start(watch);
    this.themeVariablesWatcher = watch(
      () => this.calculatedSchemeStore.calculatedScheme,
      (colors) => {
        this.applyThemeVariables(colors);
      },
      { immediate: true, deep: true }
    );
    this.loadTwitterWidget();
  },
  beforeUnmount() {
    this.calculatedSchemeSync?.stop();
    this.schemeUrlSync?.stop();
    this.themeVariablesWatcher?.();
    this.clearThemeVariables();
  },
  methods: {
    applyThemeVariables(colors) {
      applyThemeVariables(colors);
    },
    clearThemeVariables() {
      clearThemeVariables();
    },
    loadTwitterWidget() {
      if (!document.getElementById('twitter-wjs')) {
        const js = document.createElement('script');
        js.id = 'twitter-wjs';
        js.src = 'https://platform.twitter.com/widgets.js';
        document.body.appendChild(js);
      } else {
        window.twttr?.widgets.load();
      }
    },
  },
};
</script>

<style lang="less">
@app_width: 1190px;
@app_height: 555px;
@header_height: 60px;
@footer_height: 40px;

html, body {
  height: 100%;
  width: 100%;
}

</style>

<style lang="less" scoped>
@app_width: 1190px;
@app_height: 555px;
@header_height: 60px;
@footer_height: 40px;

.wrapper {
  min-height: @header_height + @app_height + @footer_height;
  height: 100%;
  margin: 0 auto (-@footer_height - 2px); /* the bottom margin is the negative value of the footer's height */
}

#editor {
  // opacity: 0;
  white-space: nowrap;
}

.distance {
  min-height: ((@app_height) / 2) - @header_height - 10px;
  margin-bottom: -(((@app_height) / 2) + @header_height) + 10px;
  width: 1px;
  height: 50%;
  margin-top: 0;
  float: left;
}

.vertical-center {
  width: @app_width;
  height: @app_height;
  z-index: 1;
  position: relative;
  margin: 0 auto;
  clear: left;
}
</style>
