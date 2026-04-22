<template>
  <section id="skews">
    <SocialMedia />
    <GetSchemeButton />
  </section>
</template>

<script>
import SocialMedia from './SocialMedia.vue';
import GetSchemeButton from './GetSchemeButton.vue';

export default {
  name: 'MainMenu',
  components: {
    SocialMedia,
    GetSchemeButton,
  },
};
</script>

<style lang="less">
#skews {
  position: absolute;
  top: 23px;
  right: 27px;
  height: 34px;
}

.skew {
  vertical-align: top;
  display: inline-block;
  height: 34px;
  transform: skew(-30deg);
  border-radius: 6px;
  margin-left: 7px;
  margin-top: 0;
}

.skew > * {
  transform: skew(30deg);
}
</style>