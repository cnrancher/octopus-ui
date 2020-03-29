export default async function({
  route, app, store, redirect, req, isDev
}) {
  // Ignore webpack hot module reload requests
  if ( route.path && typeof route.path === 'string' && route.path.startsWith('/__webpack_hmr/') ) {
    return;
  }

  // Make sure you're actually logged in
  if (!store.getters['auth/loggedIn'] ) {
    try {

    } catch (e) {
      const status = e?._status;

      if ( status === 404 ) {
        store.commit('auth/hasAuth', false);
      } else {
        store.commit('auth/hasAuth', true);

        if ( status === 401 ) {
          redirect(302, '/auth/login');
        } else {
          console.log(JSON.stringify(e));
        }
      }
    }
  }

  try {
    await Promise.all([
      store.dispatch('loadCluster')
    ]);
  } catch (e) {
    redirect(302, '/fail-whale');
  }
}
