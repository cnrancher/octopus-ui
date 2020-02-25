import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { setting } from '@/store/modules/setting';
import { RootState } from '@/store/types';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  modules: {
    setting,
  },
};

export default new Vuex.Store<RootState>(store);
