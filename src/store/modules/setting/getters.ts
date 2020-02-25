import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';
import { settingState } from './types';

const getters: GetterTree<settingState, RootState> = {
  mulCount(state): number {
    return state.count * state.count;
  },
};

export default getters;
