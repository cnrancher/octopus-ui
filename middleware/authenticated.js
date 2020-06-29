/* eslint-disable */
import { NORMAN } from '@/config/types';
import { findBy } from '@/utils/array';
import { SETUP } from '@/config/query-params';
import { get } from '@/utils/object';
import { ClusterNotFoundError } from '@/utils/error';
import applyTypeConfigs from '@/config/type-config';

export default async function({
  route, app, store, redirect, req, isDev
}) {
  if ( route.path && typeof route.path === 'string') {
    // Ignore webpack hot module reload requests
    if ( route.path.startsWith('/__webpack_hmr/') ) {
      return;
    }

    // Ignore the error page
    if ( route.path.startsWith('/fail-whale') ) { // TODO
      return;
    }
  }

  // Initial ?setup=admin-password can technically be on any route
  const initialPass = route.query[SETUP];

  if ( initialPass ) {
    // const ok = await tryInitialSetup(store, initialPass, isDev);

    // if ( ok ) {
    //   redirect(302, `/auth/setup?${ SETUP }=${ escape(initialPass) }`);
    // } else {
    //   redirect(302, '/auth/login');
    // }
  }

  // Make sure you're actually logged in, when have auth and logged in
  // if ( false && !store.getters['auth/loggedIn'] ) { // eslint-disable-line
  //   // get user messages, 
  //   try {
  //     const principals = await store.dispatch('rancher/findAll', {
  //       type: NORMAN.PRINCIPAL,
  //       opt:  { url: '/v3/principals' }
  //     });
      
  //     const me = findBy(principals, 'me', true); // TODO 有登陆角色的概念
  //     console.log('-----principals aaa', principals)
  //     store.commit('auth/loggedInAs', me.id);
  //   } catch (e) {
  //     const status = e?._status;

  //     if ( status === 404 ) {
  //       store.commit('auth/hasAuth', false);
  //     } else {
  //       store.commit('auth/hasAuth', true);

  //       if ( status === 401 ) {
  //         redirect(302, '/auth/login');
  //       } else {
  //         console.log(JSON.stringify(e)); // eslint-disable-line no-console
  //       }
  //     }
  //   }
  // }

  // Load stuff
  applyTypeConfigs(store);

  try {
    let clusterId = get(route, 'params.cluster') || 'local';

    if ( clusterId ) {
      // Run them in parallel
      await Promise.all([
        await store.dispatch('loadManagement'),
        await store.dispatch('loadCluster', clusterId),
      ]);
    } else {
      await store.dispatch('loadManagement');

      clusterId = store.getters['defaultClusterId']; // This needs the cluster list, so no parallel

      if ( clusterId ) {
        await store.dispatch('loadCluster', clusterId);
      }
    }
  } catch (e) {
    redirect(302, '/auth/login');
  }
}

async function tryInitialSetup(store, password, isDev) {
  try {
    const firstLogin = await store.dispatch('rancher/find', {
      type: NORMAN.SETTING,
      id:   'first-login',
      opt:  { url: '/v3/settings/first-login' }
    });

    if ( isDev ) {
      // Ignore first-login for dev
    } else if ( !firstLogin || firstLogin.value !== 'true' ) {
      // Require first-login to be set for prod
      return false;
    }

    const res = await store.dispatch('auth/login', {
      provider: 'local',
      body:     {
        username: 'admin',
        password
      },
    });

    return res === true;
  } catch (e) {
    console.log(e); // eslint-disable-line no-console

    return false;
  }
}
