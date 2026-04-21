<template>
  <a href="#" id="get-scheme-button" class="skew" @click.prevent="isDialogOpen = true">
    <span>Download Scheme</span>
  </a>
  <DownloadSchemeDialog :open="isDialogOpen" @close="isDialogOpen = false" />
</template>

<script>
import DownloadSchemeDialog from './DownloadSchemeDialog.vue';

export default {
  name: 'GetSchemeButton',
  components: {
    DownloadSchemeDialog,
  },
  data() {
    return {
      isDialogOpen: false,
    };
  },
};
</script>

<style lang="less">
#get-scheme-button {
  width: 163px;
  border: 1px solid #ccc;
  background: rgb(254 254 254);
  background: linear-gradient(to bottom,	rgb(254 254 254 / 100%) 0%,rgb(223 223 223 / 100%) 100%);

  span {
    white-space: nowrap;
    font-size: 20px;
    display: inline-block;
    transform: skew(30deg);
    padding: 7px 20px 0 15px;
  }

  &:hover,
  &:active {
    border: 1px solid #bbb;
  }

  &:hover {
    background: rgb(247 247 247);
    background: linear-gradient(to bottom, rgb(247 247 247 / 100%) 0%, rgb(224 224 224 / 100%) 76%, rgb(218 218 218 / 100%) 88%, rgb(209 209 209 / 100%) 100%);
  }

  &:active {
    background: rgb(225 225 225);
    background: linear-gradient(to bottom, rgb(225 225 225 / 100%) 0%, rgb(218 218 218 / 100%) 100%);
  }
}
</style>
