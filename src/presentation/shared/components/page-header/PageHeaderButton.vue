<template>
  <a
    :href="href"
    :aria-disabled="String(disabled)"
    class="skew page-header-button"
    :class="{ 'page-header-button--disabled': disabled }"
    @click="handleClick"
  >
    <span><slot /></span>
  </a>
</template>

<script>
export default {
  name: 'PageHeaderButton',
  props: {
    href: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  methods: {
    handleClick(event) {
      if (this.disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      this.$emit('click', event);
    },
  },
};
</script>

<style lang="less" scoped>
.page-header-button {
  border: 1px solid #ccc;
  background: rgb(254 254 254);
  background: linear-gradient(to bottom, rgb(254 254 254 / 100%) 0%, rgb(223 223 223 / 100%) 100%);
  color: #000;
  text-decoration: none;

  span {
    white-space: nowrap;
    font-family: Rationale, sans-serif;
    font-size: 20px;
    font-weight: normal;
    line-height: 1;
    display: inline-block;
    transform: skew(30deg);
    padding: 7px 20px 0 15px;
  }

  img {
    width: 20px;
    height: 20px;
    margin: 0 6px -4px 0;
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

.page-header-button--disabled,
.page-header-button--disabled:hover,
.page-header-button--disabled:active {
  opacity: 0.55;
  cursor: default !important;
  border: 1px solid #ccc;
  background: rgb(254 254 254);
  background: linear-gradient(to bottom, rgb(254 254 254 / 100%) 0%, rgb(223 223 223 / 100%) 100%);
}

.page-header-button--disabled *,
.page-header-button--disabled:hover *,
.page-header-button--disabled:active * {
  cursor: default !important;
}
</style>
