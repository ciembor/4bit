import './assets/styles/jquery-ui.custom.css'
import './assets/styles/jquery.ui.colorPicker.css'
import './assets/styles/reset.less';
import './assets/styles/fonts.less';
import './assets/styles/base.less';

import jQuery from 'jquery'
window.jQuery = window.$ = jQuery

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';

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
  await import('./lib/jquery.ui.colorPicker.js');

  const pinia = createPinia();
  createApp(App).use(pinia).mount('#app');
}

startApp();
