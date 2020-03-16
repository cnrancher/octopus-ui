import Steve from '@/plugins/steve';

export const strict = false;

export const plugins = [
  Steve({ namespace: 'deviceLink', baseUrl: '/v1' }),
  Steve({ namespace: 'dummyDevice', baseUrl: '/v1' }),
];

export const state = () => {
  return {
    clusterReady:    false,
  };
};

export const getters = {};

export const mutations = {
  clusterChanged(state, ready) {
    state.clusterReady = ready;
  },
};

export const actions = {
  async loadCluster({
    state, commit, dispatch, getters
  }) {
    if ( state.clusterReady ) {
      // Do nothing, we're already connected to this cluster
      return;
    }

    dispatch('deviceLink/subscribe');
    await dispatch('deviceLink/loadSchemas');

    dispatch('dummyDevice/subscribe');
    await dispatch('dummyDevice/loadSchemas');
    commit('clusterChanged', true);
  },

  nuxtServerInit(ctx, nuxt) {
    Object.defineProperty(ctx.rootState, '$router', { value: nuxt.app.router });
    Object.defineProperty(ctx.rootState, '$route', { value: nuxt.route });
  },

  nuxtClientInit({ dispatch }) {}
};
