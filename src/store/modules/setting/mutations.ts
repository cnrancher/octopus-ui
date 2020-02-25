import { MutationTree } from 'vuex';
import { IsettingState } from './types';

const mutations: MutationTree<IsettingState> = {
  changeCount(state) {
    state.count += 1;
  },
  getList(state, list: object[]) {
    state.list = list;
  },
};

export default mutations;
