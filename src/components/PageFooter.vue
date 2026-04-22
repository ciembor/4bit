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
        href="https://pl.linkedin.com/in/maciej-ciemborowicz-57202470"
        rel="me"
        target="_blank"
        class="footer-link"
      >Maciej Ciemborowicz</a>{{ ' ' }}
      <a
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
};
</script>

<style lang="less">
@app_width: 1190px;
@footer_height: 40px;

footer {
  min-width: @app_width;
  height: @footer_height;
  overflow: visible;
  font-size: 20px;
  width: 100%;

  p {
    display: inline-block;
  }

  .left {
    float: left;
    margin-left: 20px;
    padding-bottom: 20px;

    img {
      width: 20px;
      height: 20px;
      margin: 0 0 -2px;
    }
  }

  .right {
    float: right;
    margin-right: 20px;
    padding-bottom: 20px;
  }

  .left,
  .right {
    opacity: 0.5;
  }

  .left:hover,
  .right:hover {
    opacity: 1;
  }

}

#footer p:hover .footer-link {
  color: var(--color-blue);
}

#footer p:hover .footer-link:visited {
  color: var(--color-magenta);
}

.twitter-follow-button {
  display: inline-block;
  margin-bottom: -4px;
  font-size: 0;
  width: 74px;
}

</style>
