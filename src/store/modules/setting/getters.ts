import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';
import { IsettingState } from '@/store/modules/setting/types';

const getters: GetterTree<IsettingState, RootState> = {
  mulCount(state): number {
    return state.count * state.count;
  },
};

export default getters;
