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

  loggedInAs(state, principalId) {
    state.loggedIn = true;
  },

  loggedOut(state) {
    state.loggedIn = false;
  },
};

export const actions = {
  async login({ dispatch }, { body }) {

    Cookies.set(R_SESS, `${body.username}:${body.password}`, {
      expires: 2,
      path: '/',
      secure: true,
    });

    try {
      await dispatch('deviceLink/findAll', {
        opt:  {
          url:    `/v1`,
          method: 'get',
        }
      }, { root: true });
      
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
