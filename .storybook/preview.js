import { addParameters } from '@storybook/vue';

import '!style-loader!css-loader!sass-loader!../assets/styles/app.scss';

addParameters({
  backgrounds: [
    { name: 'Dark Theme', value: '#000', default: true },
    { name: 'Light Theme', value: '#6C6C76' },
  ],
  options: {
    showRoots: true
  }
});
