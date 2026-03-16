import { configure } from 'quasar/wrappers';

export default configure(() => {
  return {
    boot: ['i18n'],

    css: ['app.scss'],

    extras: ['material-icons'],

    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20',
      },
      vueRouterMode: 'history',
      vitePlugins: [],
    },

    devServer: {
      open: false,
    },

    framework: {
      plugins: ['Notify'],
    },
  };
});
