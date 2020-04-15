/* eslint-disable */
import Steve from '@/plugins/steve';
import { CUSTOM } from '@/config/types';

export const strict = false;

export const plugins = [
  Steve({ namespace: 'deviceLink', baseUrl: '/v1' }),
  Steve({ namespace: 'deviceModel', baseUrl: '/v1' }),
];

export const state = () => {
  return {
    clusterReady: false,
    devicesType:  [],
  };
};

export const getters = {};

export const mutations = {
  clusterChanged(state, ready) {
    state.clusterReady = ready;
  },
  
  setDevicesType(state, customresources) {
    const customResource = customresources.filter((custom) => {
      if (custom.metadata.annotations?.['devices.edge.cattle.io/enable'] === 'true') {
        return true
      }
    });

    state.devicesType = customResource;
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

    commit('setDevicesType', customresource);
    
    const devicesType = state.devicesType;
    Object.values(devicesType).reduce((all, device) => {
      const type = device.spec.names.kind.toLowerCase();
      const url = `devices.edge.cattle.io.${type}`;
      dispatch('deviceModel/findAll', { type, opt: { url} });
    }, {})

    commit('clusterChanged', true);
  },

  nuxtServerInit(ctx, nuxt) {
    Object.defineProperty(ctx.rootState, '$router', { value: nuxt.app.router });
    Object.defineProperty(ctx.rootState, '$route', { value: nuxt.route });
  },

  nuxtClientInit({ dispatch }) {}
};
