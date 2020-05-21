import { allHash } from '@/utils/promise';
import {
  NODE, PODS, EVENTS, COMPONENTS_STATUS, METRIC, DEVICE_LINKS, K3S
} from '@/config/types';
const ERR_CLIENT = 'client';
const ERR_SERVER = 'server';

export const state = function() {
  return {
    nodes:             [],
    events:            [],
    nodesMetrics:      [],
    pods:              [],
    devices:           [],
    podsLoadInfo:      [],
    datastorage:       true,
    systemControllers: [],
    networking:        []
  };
};

export const getters = {
  nodes(state) {
    return state.nodes;
  },
  events(state) {
    return state.events;
  },
  nodesMetrics(state) {
    return state.nodesMetrics;
  },
  pods(state) {
    return state.pods;
  },
  devices(state) {
    return state.devices;
  },
  podsLoadInfo(state) {
    return state.podsLoadInfo;
  },
  datastorage(state) {
    return state.datastorage;
  },
  systemControllers(state) {
    return state.systemControllers;
  },
  networking(state) {
    return state.networking;
  }
};

export const mutations = {
  updateNodes(state, newNodes) {
    state.nodes = newNodes;
  },
  updateNodesMetrics(state, newNodesMetrics) {
    state.nodesMetrics = newNodesMetrics;
  },
  updateEvents(state, newEvents) {
    state.events = newEvents;
  },
  updatePods(state, newPods) {
    state.pods = newPods;
  },
  updateDevices(state, newDevices) {
    state.devices = newDevices;
  },
  updatePodsLoadInfo(state, newPodsLoadInfo) {
    state.podsLoadInfo = newPodsLoadInfo;
  },
  updateDatastorage(state, newDatastorage) {
    state.datastorage = newDatastorage;
  },
  updateSystemControllers(state, newSystemControllers) {
    state.systemControllers = newSystemControllers;
  },
  updateNetworking(state, newNetworking) {
    state.networking = newNetworking;
  }
};

export const actions = {
  async fetchALl({ dispatch, commit }, { body }) {
    try {
      const {
        nodesData, nodesMetricsData, podsData, devices, podsLoadInfo, events, datastorage, systemControllers, networking
      } = await allHash({
        nodesData:         dispatch('management/findAll', { type: 'node', opt: { url: NODE } }, { root: true }),
        nodesMetricsData:  dispatch('management/findAll', { type: 'metrics.k8s.io.nodemetrics', opt: { url: METRIC.NODE } }, { root: true }),
        podsData:          dispatch('management/findAll', { type: 'pod', opt: { url: PODS } }, { root: true }),
        devices:           dispatch('management/findAll', { type: 'edge.cattle.io.devicelink', opt: { url: DEVICE_LINKS } }, { root: true }),
        podsLoadInfo:      dispatch('management/findAll', { type: 'metrics.k8s.io.podmetrics', opt: { url: METRIC.POD } }, { root: true }),
        events:            dispatch('management/findAll', { type: 'event', opt: { url: EVENTS } }, { root: true }),
        datastorage:       dispatch('management/request', { url: '/v2-public/health/datastorage', method: 'get' }, { root: true }),
        systemControllers: dispatch('management/findAll', { type: 'componentstatus', opt: { url: COMPONENTS_STATUS } }, { root: true }),
        networking:        dispatch('management/findAll', { type: 'k3s.cattle.io.addon', opt: { url: K3S.ADDONS } }, { root: true })
      });

      commit('updateNodes', nodesData);
      commit('updateNodesMetrics', nodesMetricsData);
      commit('updatePods', podsData);
      commit('updateDevices', devices);
      commit('updatePodsLoadInfo', podsLoadInfo);
      commit('updateEvents', events);
      commit('updateDatastorage', datastorage);
      commit('updateSystemControllers', systemControllers);
      commit('updateNetworking', networking);
    } catch (err) {
      if ( err._status >= 400 && err._status <= 499 ) {
        return Promise.reject(ERR_CLIENT);
      }

      return Promise.reject(ERR_SERVER);
    }
  },
  async fetchNodes({ dispatch, commit }, { body }) {
    try {
      const res = await dispatch('management/findAll', {
        type:    NODE,
        opt:  { url: NODE }
      }, { root: true });

      commit('updateNodes', res);

      return res;
    } catch (err) {
      if ( err._status >= 400 && err._status <= 499 ) {
        return Promise.reject(ERR_CLIENT);
      }

      return Promise.reject(ERR_SERVER);
    }
  },
  async getSystemServiceStatus({ dispatch, commit, rootGetters }, { body }) {
    try {
      const res = await dispatch('management/request', { url: `/v2-public/health/datastorage`, method: 'get' }, { root: true });

      commit('updateDatastorage', res);
    } catch (err) {
      if ( err._status >= 400 && err._status <= 499 ) {
        return Promise.reject(ERR_CLIENT);
      }

      return Promise.reject(ERR_SERVER);
    }
  }
};
