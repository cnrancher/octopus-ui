import { parse as setCookieParser } from 'set-cookie-parser';
import { randomStr } from '@/utils/string';
import { parse as parseUrl, addParam, addParams } from '@/utils/url';
import { findBy, addObjects } from '@/utils/array';
import { BACK_TO, SPA, AUTH_TEST, _FLAGGED } from '@/config/query-params';

const KEY = 'rc_nonce';

const ERR_NONCE = 'nonce';
const ERR_CLIENT = 'client';
const ERR_SERVER = 'server';

export const state = function() {
  return {
    hasAuth:     null,
    loggedIn:    false,
  };
};

export const getters = {
  loggedIn(state) {
    return state.loggedIn;
  },
};

export const mutations = {
  hasAuth(state, hasAuth) {
    state.hasAuth = !!hasAuth;
  },

  loggedInAs(state, principalId) {
    state.loggedIn = true;
  },

  loggedOut(state) {
    state.loggedIn = false;
  },
};

export const actions = {
  login({ dispatch }, { body }) {
    try {
      console.log('username: password', `${body.username}: ${body.password}`);
      return true;
    } catch (err) {
      if ( err._status >= 400 && err._status <= 499 ) {
        return Promise.reject(ERR_CLIENT);
      }

      return Promise.reject(ERR_SERVER);
    }
  },

  logout({ dispatch, commit }, clearToken = true) {
    if ( clearToken !== false ) {
      try {
        console.log('To simulate the exit...');
      } catch (e) {
      }
    }

    commit('loggedOut');
    dispatch('onLogout', null, { root: true });
  }
};
