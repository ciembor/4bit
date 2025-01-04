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
import AppLogo from './components/page_header/AppLogo.vue';
import MainMenu from './components/page_header/MainMenu.vue';
import TerminalDisplay from './components/TerminalDisplay.vue';
import EditorControls from './components/EditorControls.vue'
import PageFooter from './components/PageFooter.vue';
import DynamicStyle from './services/DynamicStyle';

export default {
  name: 'App',
  components: {   
    AppLogo,
    MainMenu,
    TerminalDisplay,
    EditorControls,
    PageFooter
  },
  mounted() {
    DynamicStyle.observeStore();
    this.loadTwitterWidget();
  },
  methods: {
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

.wrapper {
	min-height: @header_height + @app_height + @footer_height;
	height: 100%;
	margin: 0 auto (-@footer_height - 1px); /* the bottom margin is the negative value of the footer's height */
}

header {
  position: relative;
  min-width: @app_width;
  height: @header_height;
  overflow: visible;
}

body {
  background-color: #eee;
	font-family: Rationale, sans-serif;

    h1 {
      color: #777;
      font-size: 48px;
      display: inline-block;
      margin: 18px 0 0 20px;

    a {
      color: #777;
    }
  }
}

#editor {
	// opacity: 0;
	white-space: nowrap;
}

.distance {
	min-height: ((@app_height) / 2) - @header_height -10px;
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
