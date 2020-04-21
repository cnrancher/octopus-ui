const ERR_CLIENT = 'client';
const ERR_SERVER = 'server';

export const state = function() {
  return {};
};

export const getters = {};

export const mutations = {};

export const actions = {
  async getMetricsIoNodes({ dispatch, commit }, { body }) {
    try {
      const rets = await Promise.all([
        dispatch('deviceLink/request', {
          url:    `/v1/metrics.k8s.io.nodes`,
          method: 'get'
        }, { root: true }),
        dispatch('deviceLink/request', {
          url:    `/v1/nodes`,
          method: 'get'
        }, { root: true }),
        dispatch('deviceLink/request', {
          url:    `/v1/pods`,
          method: 'get'
        }, { root: true })
      ]);
      const nodesMetricsData = rets[0].data;
      const nodesData = rets[1].data;
      const podsData = rets[2].data;

      return {
        nodesMetricsData, nodesData, podsData
      };
    } catch (err) {
      if ( err._status >= 400 && err._status <= 499 ) {
        return Promise.reject(ERR_CLIENT);
      }

      return Promise.reject(ERR_SERVER);
    }
  },

  async getDeviceInfo({ dispatch, commit }, { body }) {
    try {
      const res = await dispatch('deviceLink/request', {
        url:    `/v1/edge.cattle.io.devicelinks`,
        method: 'get'
      }, { root: true });

      return res.data;
    } catch (err) {
      if ( err._status >= 400 && err._status <= 499 ) {
        return Promise.reject(ERR_CLIENT);
      }

      return Promise.reject(ERR_SERVER);
    }
  },

  async getPodsLoadInfo({ dispatch, commit }, { body }) {
    try {
      const rets = await Promise.all([
        dispatch('deviceLink/request', {
          url:    `/v1/nodes`,
          method: 'get'
        }, { root: true }),
        dispatch('deviceLink/request', {
          url:    `/v1/metrics.k8s.io.pods`,
          method: 'get'
        }, { root: true })
      ]);
      const nodesData = rets[0].data;
      const podsData = rets[1].data;

      return {
        nodesData, podsData
      };
    } catch (err) {
      if ( err._status >= 400 && err._status <= 499 ) {
        return Promise.reject(ERR_CLIENT);
      }

      return Promise.reject(ERR_SERVER);
    }
  },
  async getEvents({ dispatch, commit }, { body }) {
    try {
      const res = await dispatch('deviceLink/request', {
        url:    `/v1/events`,
        method: 'get'
      }, { root: true });
      
      return res.data;
    } catch (err) {
      if ( err._status >= 400 && err._status <= 499 ) {
        return Promise.reject(ERR_CLIENT);
      }

      return Promise.reject(ERR_SERVER);
    }
  },
  async getSystemServiceStatus({ dispatch, commit }, { body }) {
    try {
      const rets = await Promise.all([
        dispatch('deviceLink/request', {
          url:    `/v2-public/health/datastorage`,
          method: 'get'
        }, { root: true }),
        dispatch('deviceLink/request', {
          url:    `/v1/componentstatuses`,
          method: 'get'
        }, { root: true }),
        dispatch('deviceLink/request', {
          url:    `/v1/k3s.cattle.io.addons`,
          method: 'get'
        }, { root: true }),
        dispatch('deviceLink/request', {
          url:    `/v1/nodes`,
          method: 'get'
        }, { root: true }),
      ]);

      return { datastorage: rets[0], systemControllers: rets[1].data, networking: rets[2].data, nodes: rets[3].data };
    } catch (err) {
      if ( err._status >= 400 && err._status <= 499 ) {
        return Promise.reject(ERR_CLIENT);
      }

      return Promise.reject(ERR_SERVER);
    }
  }
};
