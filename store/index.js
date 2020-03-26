import Steve from '@/plugins/steve';

export const strict = false;

export const plugins = [
  Steve({ namespace: 'deviceLink', baseUrl: '/v1' }),
  Steve({ namespace: 'deviceModel', baseUrl: '/v1' }),
];

export const state = () => {
  return { clusterReady: false };
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
    //
    dispatch('deviceModel/find', {
      type: 'deviceModelMenu',
      id:   'addons.k3s.cattle.io',
      opt:  {
        url: 'apiextensions.k8s.io.customresourcedefinitions',
        // filters: {
        //   label: [{"modifier": "eq", "value":"app.kubernetes.io/name"}],
        // }
      }
    }).then((rows) => {
      console.log('腹肌的rows', rows);

      return { rows };
    });

    dispatch('deviceLink/subscribe');
    await dispatch('deviceLink/loadSchemas');

    dispatch('deviceModel/subscribe');
    await dispatch('deviceModel/loadSchemas');

    commit('clusterChanged', true);
  },

  nuxtServerInit(ctx, nuxt) {
    Object.defineProperty(ctx.rootState, '$router', { value: nuxt.app.router });
    Object.defineProperty(ctx.rootState, '$route', { value: nuxt.route });
  },

  nuxtClientInit({ dispatch }) {}
};
