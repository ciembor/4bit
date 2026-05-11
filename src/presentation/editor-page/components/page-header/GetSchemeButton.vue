<template>
  <PageHeaderButton
    id="get-scheme-button"
    href="#"
    :disabled="disabled"
    @click.prevent="isDialogOpen = true"
  >
    Download Scheme
  </PageHeaderButton>
  <DownloadSchemeDialog v-if="!disabled" :open="isDialogOpen" @close="isDialogOpen = false" />
</template>

<script>
import DownloadSchemeDialog from './DownloadSchemeDialog.vue';
import PageHeaderButton from '../../../shared/components/page-header/PageHeaderButton.vue';

export default {
  name: 'GetSchemeButton',
  components: {
    DownloadSchemeDialog,
    PageHeaderButton,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isDialogOpen: false,
    };
  },
};
</script>
