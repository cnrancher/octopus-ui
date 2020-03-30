import Steve from '@/plugins/steve';
import { CUSTOM } from '@/config/types'

export const strict = false;

export const plugins = [
  Steve({ namespace: 'deviceLink', baseUrl: '/v1' }),
  Steve({ namespace: 'deviceModel', baseUrl: '/v1' }),
];

export const state = () => {
  return {
    clusterReady: false,
    dynamicMenu:  [],
  };
};

export const getters = {};

export const mutations = {
  clusterChanged(state, ready) {
    state.clusterReady = ready;
  },
  setDynamicMenu(state, customresources) {
    const menus = customresources.filter((element) => {
      return element.id.includes('.devices.edge.cattle.io');
    });

    state.dynamicMenu = menus;
  }
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

    dispatch('deviceModel/subscribe');
    await dispatch('deviceModel/loadSchemas');
    
    const customresource = await dispatch('deviceModel/findAll', {
      type: CUSTOM,
      opt:  { url: CUSTOM }
    });

    commit('setDynamicMenu', customresource);
    commit('clusterChanged', true);
  },

  nuxtServerInit(ctx, nuxt) {
    Object.defineProperty(ctx.rootState, '$router', { value: nuxt.app.router });
    Object.defineProperty(ctx.rootState, '$route', { value: nuxt.route });
  },

  nuxtClientInit({ dispatch }) {}
};
