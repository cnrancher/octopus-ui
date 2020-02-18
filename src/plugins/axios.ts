import Vue, { PluginObject } from 'vue';
import axios from 'axios';

const config = { timeout: 60 * 1000 };

const http = axios.create(config);

const Plugin: PluginObject<{}> = {
  install: () => {
    Vue.$http = http;
  },
};

Plugin.install = () => {
  Vue.$http = http;
  window.http = http;
  Object.defineProperties(Vue.prototype, {
    $http: {
      get() {
        return http;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
