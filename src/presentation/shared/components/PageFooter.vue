<template>
  <footer id="footer">
    <p class="left">
      <a
        href="http://github.com/ciembor/4bit"
        target="_blank"
        class="footer-link"
      ><img src="/images/github.png" alt="" /> Fork 4bit on GitHub.</a>
    </p>
    <p class="right">
      Developed by
      <a
        href="https://maciej-ciemborowicz.eu"
        rel="me"
        target="_blank"
        class="footer-link"
      >Maciej Ciemborowicz</a>{{ ' ' }}
      <a
        v-if="showTwitterFollow"
        href="https://twitter.com/ciembor"
        class="twitter-follow-button footer-link"
        data-show-count="false"
        data-show-screen-name="false"
      >follow</a>
      {{ ' and ' }}
      <a
        href="https://github.com/ciembor/4bit#contributors"
        target="_blank"
        class="footer-link"
      >contributors</a>
      {{ ' since 2012.' }}
    </p>
  </footer>
</template>

<script>
export default {
  name: 'PageFooter',
  props: {
    showTwitterFollow: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
