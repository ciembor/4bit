import '../shared/assets/styles/reset.less';
import '../shared/assets/styles/fonts.less';
import '../shared/assets/styles/base.less';
import '../shared/assets/styles/page-shell.less';

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import AboutPage from './AboutPage.vue';
import { initializeAboutPageTheme } from './theme-bootstrap';

const pinia = createPinia();

initializeAboutPageTheme(pinia);
createApp(AboutPage).use(pinia).mount('#about-page');
