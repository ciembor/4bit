<template>
  <div class="wrapper">
    <header>
      <AppLogo />
      <MainMenu />
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
import AppLogo from './components/page-header/AppLogo.vue';
import MainMenu from './components/page-header/MainMenu.vue';
import TerminalDisplay from './components/TerminalDisplay.vue';
import EditorControls from './components/EditorControls.vue';
import PageFooter from './components/PageFooter.vue';
import CalculatedSchemeSync from '../application/scheme/calculated-scheme-sync';
import { SchemeUrlSync } from '../infrastructure/browser/scheme-url-sync';
import { useCalculatedSchemeStore } from './stores/calculated-scheme';
import { COLOR_NAMES, SPECIAL_COLOR_NAMES } from '../domain/scheme/color-names';

function cssVariableName(colorName) {
  return `--color-${colorName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;
}

export default {
  name: 'App',
  components: {
    AppLogo,
    MainMenu,
    TerminalDisplay,
    EditorControls,
    PageFooter,
  },
  setup() {
    const calculatedSchemeStore = useCalculatedSchemeStore();

    return { calculatedSchemeStore };
  },
  mounted() {
    this.calculatedSchemeSync = new CalculatedSchemeSync();
    this.schemeUrlSync = new SchemeUrlSync();
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
      const themeRoot = document.body;

      [...COLOR_NAMES, ...SPECIAL_COLOR_NAMES].forEach((colorName) => {
        const color = colors[colorName];
        const variableName = cssVariableName(colorName);

        if (color) {
          themeRoot.style.setProperty(variableName, color.hex());
        } else {
          themeRoot.style.removeProperty(variableName);
        }
      });
    },
    clearThemeVariables() {
      const themeRoot = document.body;

      [...COLOR_NAMES, ...SPECIAL_COLOR_NAMES].forEach((colorName) => {
        themeRoot.style.removeProperty(cssVariableName(colorName));
      });
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

body {
  background-color: #eee;
  font-family: Rationale, sans-serif;
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

header {
  position: relative;
  min-width: @app_width;
  height: @header_height;
  overflow: visible;
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
