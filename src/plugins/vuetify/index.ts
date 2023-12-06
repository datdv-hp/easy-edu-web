// Vuetify
import 'vuetify/styles';
import { createVuetify, type IconAliases } from 'vuetify';
import { aliases as defaultAliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import './styles/index.scss';
import customIcons from './custom-icons';
import customLightTheme from './theme';

const aliases: IconAliases = {
  ...defaultAliases,
  ...customIcons,
};

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    themes: { light: customLightTheme },
  },
});

export default vuetify;
