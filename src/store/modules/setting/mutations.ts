import { MutationTree } from 'vuex';
import { settingState } from './types';

const mutations: MutationTree<settingState> = {
  changeCount(state) {
    state.count += 1;
  },
  getList(state, list) {
    state.list = list;
  },
};

export default mutations;
