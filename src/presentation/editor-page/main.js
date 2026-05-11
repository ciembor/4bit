import '../shared/assets/styles/jquery-ui.custom.css'
import '../shared/assets/styles/jquery.ui.colorPicker.css'
import '../shared/assets/styles/reset.less';
import '../shared/assets/styles/fonts.less';
import '../shared/assets/styles/base.less';
import '../shared/assets/styles/page-shell.less';

import jQuery from 'jquery'
window.jQuery = window.$ = jQuery

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import EditorPage from './EditorPage.vue';
import { hydrateSchemeStoreFromLocation } from '../../infrastructure/browser/scheme-url-sync';
import { useSchemeStore } from '../shared/stores/scheme';

async function startApp() {
  await import('jquery-ui/ui/version');
  await import('jquery-ui/ui/widget');
  await import('jquery-ui/ui/data');
  await import('jquery-ui/ui/plugin');
  await import('jquery-ui/ui/scroll-parent');
  await import('jquery-ui/ui/keycode');
  await import('jquery-ui/ui/widgets/mouse');
  await import('jquery-ui/ui/widgets/draggable');
  await import('jquery-ui/ui/widgets/slider');
  await import('../../infrastructure/vendor/jquery.ui.colorPicker.js');

  const pinia = createPinia();
  hydrateSchemeStoreFromLocation(useSchemeStore(pinia));
  createApp(EditorPage).use(pinia).mount('#app');
}

startApp();
