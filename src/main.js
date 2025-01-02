import './assets/styles/main.less';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';

const pinia = createPinia();
createApp(App).use(pinia).mount('#app');