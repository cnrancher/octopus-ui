export const state = function() {
  return {
    showInfo: {
      isShow: false,
      id:     ''
    }
  };
};

export const getters = {};

export const mutations = {
  showModelInfo(state, isShow) {
    state.showInfo = isShow;
  }
};

export const actions = {
  showModelInfo({ commit, state }, isShow) {
    commit('showRefreshModel', isShow);
  }
};
