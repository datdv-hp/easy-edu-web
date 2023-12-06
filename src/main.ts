import { createApp } from 'vue';

import App from './App.vue';
import './assets/styles/global.scss';
import plugins from './plugins';
import router from './plugins/vue-router';

const app = createApp(App);

app.use(router);
app.use(plugins.pinia);
app.use(plugins.i18n);
app.use(plugins.vuetify);

app.mount('#app');
