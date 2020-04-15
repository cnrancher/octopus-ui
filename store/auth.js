import Cookies from 'js-cookie';
import { R_SESS } from '@/config/cookies';
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

  loggedIn(state) {
    state.loggedIn = true;
  },

  loggedOut(state) {
    state.loggedIn = false;
  },
};

export const actions = {
  async login({ dispatch, commit }, { body }) {
    try {
      const res = await dispatch('deviceLink/find', {
        opt:  {
          url:    `/v2-public/auth?action=login`,
          method: 'post',
          auth:   body
        }
      }, { root: true });

      if (res.data) {
        commit('loggedIn');
        Cookies.set(R_SESS, `${ res.data }`, {
          expires: 2,
          path:    '/',
          secure:  true,
        });
      }

      return true;
    } catch (err) {
      if ( err._status >= 400 && err._status <= 499 ) {
        return Promise.reject(ERR_CLIENT);
      }

      return Promise.reject(ERR_SERVER);
    }
  },

  async logout({ dispatch, commit }) {
    await dispatch('deviceLink/find', {
      opt:  {
        url:                  `/v2-public/auth?action=logout`,
        method:               'get',
        redirectUnauthorized: false,
      }
    }, { root: true });

    commit('loggedOut');
  }
};
