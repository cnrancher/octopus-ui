import vue from 'vue';
import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import { settingState } from './types';

const actions: ActionTree<settingState, RootState> = {
  fetchData({ commit }): void {
    vue.$http.get('http://mock-api.com/EgdR8EKM.mock/data_copy').then((response) => {
      const list: object = response.data.items;
      console.log('getList', list);
      commit('getList', list);
    }, (error) => {
      console.log('error', error);
    });
  },
};

export default actions;
