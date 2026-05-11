<template>
  <PageHeaderButton id="about-button" :href="href">{{ label }}</PageHeaderButton>
</template>

<script>
import PageHeaderButton from './PageHeaderButton.vue';

export default {
  name: 'AboutButton',
  components: {
    PageHeaderButton,
  },
  props: {
    href: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
};
</script>
