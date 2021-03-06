const path = require('path');

module.exports = {
  stories: [
    '../stories/**/Welcome*.stories.(js|mdx)',
    '../stories/**/*.stories.(js|mdx)',
    '../components/**/*.stories.(js|mdx)'
  ],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs/register',
    {
      name: '@storybook/addon-docs',
      options: {
        vueDocgenOptions: {
          alias: {
            '@': path.resolve(__dirname, '../'),
            '~': path.resolve(__dirname, '../'),
          },
        },
      },
    },
    'storybook-addon-themes'
  ],
  presets: ['@storybook/preset-scss'],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    const extraRules = [
      {
        test: /\.s?css$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, '../')
      },
      {
        test: /\.(svg|woff|woff2|ttf)$/,
        loader: "file-loader",
        include: path.resolve(__dirname, '../')
      }
    ];

    config.module.rules.push(...extraRules);

    config.resolve.alias['@'] = path.dirname(path.resolve(__dirname));
    config.resolve.alias['~'] = path.dirname(path.resolve(__dirname));

    config.resolve.modules.push(path.resolve(__dirname, '../'));

    // console.dir(config, { depth: null }) || config

    // Return the altered config
    return config;
  }
};
