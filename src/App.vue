<template>
  <div class="wrapper">
    <header>
      <AppLogo />
      <MainMenu />
    </header>
  </div>
  <PageFooter />
</template>

<script>
import AppLogo from './components/page_header/AppLogo.vue';
import MainMenu from './components/page_header/MainMenu.vue';
import PageFooter from './components/PageFooter.vue';


export default {
  name: 'App',
  components: {   
    AppLogo,
    MainMenu,
    PageFooter
  },

  mounted() {
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
