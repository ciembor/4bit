import './assets/styles/jquery-ui.custom.css'
import './assets/styles/main.less';

import jQuery from 'jquery'
window.jQuery = window.$ = jQuery

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';

async function startApp() {
  await import('jquery-ui');
  await import('jquery-ui/ui/widgets/mouse');
  await import('jquery-ui/ui/widgets/slider');

  const pinia = createPinia();
  createApp(App).use(pinia).mount('#app');
}

startApp();
