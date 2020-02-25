import { Module } from 'vuex';
import { RootState } from '@/store/types';
import { settingState } from './types';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

const state: settingState = {
  count: 0,
  list: [],
};

const namespaced = true;
export const setting: Module<settingState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};

export default state;
