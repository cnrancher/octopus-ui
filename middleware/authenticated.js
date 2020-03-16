import { NORMAN } from '@/config/types';
import { findBy } from '@/utils/array';
import { SETUP } from '@/config/query-params';
import { get } from '@/utils/object';
import { ClusterNotFoundError } from '@/utils/error';

export default async function({
  route, app, store, redirect, req, isDev
}) {
  await Promise.all([
    store.dispatch('loadCluster'),
  ]);
}
