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
  }

  .inner {
    position: absolute;
    top: 7px;
    left: 15px;
    display: block;
    width: 73px;
    height: 20px;
  }

  .twitter-share-button {
    font-size: 0;
  }
}
</style>
