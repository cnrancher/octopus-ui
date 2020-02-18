module.exports = {
  pages: {
    index: {
      entry: 'src/main.ts',
      title: 'Rancer Edge',
    },
  },

  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "@/assets/styles/app.scss";',
      },
    },
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
};
