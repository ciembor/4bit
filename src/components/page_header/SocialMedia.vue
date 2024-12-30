<template>
  <div id="social-media" class="skew">
    <div class="inner">
      <div class="buttons">
        <a href="https://twitter.com/share" class="twitter-share-button" data-count="none" data-via="ciembor">
          Tweet
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SocialMedia',
};
</script>

<style lang="less">
#social-media {
  border: 1px solid #AAA;
  background-color: #C9C9C9;
  position: relative;
  padding: 7px 15px 0;
  width: 74px;
  height: 27px;
  display: inline-block;
  white-space: nowrap;

  .buttons {
    display: inline-block;
  }

  .inner {
    position: absolute;
    display: block;
    width: 74px;
    height: 20px;
  }

  .twitter-share-button {
    font-size: 0;
  }
}
</style>