import Vue, { VueConstructor } from 'vue';
import { AxiosInstance } from 'axios';

declare global {
  interface Window {
    http: AxiosInstance;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $http: AxiosInstance;
  }
  interface VueConstructor {
    $http: AxiosInstance;
  }
}
