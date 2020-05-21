import Cookies from 'js-cookie';
import { parse as setCookieParser } from 'set-cookie-parser';
import { findBy } from '@/utils/array';

const KEY = 'rc_nonce';

const ERR_NONCE = 'nonce';
const ERR_CLIENT = 'client';
const ERR_SERVER = 'server';

export const state = function() {
  return {
    hasAuth:     null,
    loggedIn:    false,
    principalId: null,
  };
};

export const getters = {
  enabled(state) {
    return state.hasAuth;
  },

  loggedIn(state) {
    return state.loggedIn;
  },

  principalId(state) {
    return state.principalId;
  },
};

export const mutations = {
  hasAuth(state, hasAuth) {
    state.hasAuth = !!hasAuth;
  },

  loggedInAs(state, principalId) {
    state.loggedIn = true;
    state.principalId = principalId;

    this.$cookies.remove(KEY);
  },

  loggedOut(state) {
    // Note: plugin/norman/index watches for this mutation
    // to automatically disconnect subscribe sockets.

    state.loggedIn = false;
    state.principalId = null;
  },
};

export const actions = {
  getAuthProviders({ dispatch }) {
    return dispatch('rancher/findAll', {
      type: 'authProvider',
      opt:  { url: `/v3-public/authProviders`, watch: false }
    }, { root: true });
  },

  getAuthConfigs({ dispatch }) {
    return dispatch('rancher/findAll', {
      type: 'authConfig',
      opt:  { url: `/v3/authConfigs` }
    }, { root: true });
  },

  async getAuthProvider({ dispatch }, id) {
    const authProviders = await dispatch('getAuthProviders');

    return findBy(authProviders, 'id', id);
  },

  async getAuthConfig({ dispatch }, id) {
    const authConfigs = await dispatch('getAuthConfigs');

    return findBy(authConfigs, 'id', id);
  },

  async login({ dispatch }, { body }) {
    try {
      const res = await this.$axios({
        method: 'post',
        url:    '/v2-public/auth?action=login',
        auth:   {
          username: 'admin',
          password: '4fd1a96f8b541cc37368fdb7d1302630'
        }
      });

      if (res.data) {
        Cookies.set('R_SESS', `${ res.data }`, {
          expires: 2,
          path:    '/',
          secure:  true,
        });
      }

      // if (process.server) {
      //   const parsed = setCookieParser(res._headers['set-cookie'] || []);
      //   for (const opt of parsed) {
      //     const key = opt.name;
      //     const value = opt.value;

      //     delete opt.name;
      //     delete opt.value;

      //     opt.encode = x => x;
      //     opt.sameSite = false;

      //     this.$cookies.set(key, value, opt);
      //   }
      // }

      return true;
    } catch (err) {
      if (err._status >= 400 && err._status <= 499) {
        return Promise.reject(ERR_CLIENT);
      }

      return Promise.reject(ERR_SERVER);
    }
  },

  async logout({ dispatch, commit }, clearToken = true) {
    if (clearToken !== false) {
      try {
        await this.$axios({
          method: 'get',
          url:    '/v2-public/auth?action=logout',
        });
      } catch (e) {
        // do something
      }
    }

    commit('loggedOut');
    dispatch('onLogout', null, { root: true });
  }
};
