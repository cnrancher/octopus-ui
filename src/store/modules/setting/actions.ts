import vue from 'vue';
import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import { IsettingState } from './types';

const actions: ActionTree<IsettingState, RootState> = {
  fetchData({ commit }): void {
    vue.$http.get('http://mock-api.com/EgdR8EKM.mock/data_copy').then((response) => {
      const list: object[] = response.data.items;
      commit('getList', list);
    }, (error) => {
      console.log('error', error) // eslint-disable-line
    });
  },
};

export default actions;
