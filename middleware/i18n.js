export default async function({
  isHMR, app, store, route, params, error, redirect
}) {
  if (isHMR) {
    return;
  }

  await store.dispatch('i18n/init');
}
