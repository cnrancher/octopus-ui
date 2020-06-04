<script>
import { STATE, AGE, NAMESPACE_NAME, TYPE } from '@/config/table-headers';
import ResourceTable from '@/components/ResourceTable';
import { STORAGE_CATEGORY, SCHEMA } from '@/config/types';
import { allHash } from '@/utils/promise';

const schema = {
  id:         'store',
  type:       SCHEMA,
  attributes: {
    kind:       'Store',
    namespaced: true
  },
  metadata: { name: 'store' },
};

export default {
  name:       'ListStore',
  components: { ResourceTable },

  props: {
    // The things out of asyncData come in as props
    resources: {
      type:    Object,
      default: null,
    },
  },

  data() {
    return { activeName: 'storageclass' };
  },

  computed: {
    schema() {
      return schema;
    },

    headers() {
      return [
        STATE,
        TYPE,
        NAMESPACE_NAME,
        AGE,
      ];
    },
  },

  async asyncData({ store }) {
    const resources = await allHash({
      persistentvolume: store.dispatch('cluster/findAll', { type: STORAGE_CATEGORY.PERSISTENT_VOLUME }),
      storageclass:     store.dispatch('cluster/findAll', { type: STORAGE_CATEGORY.STORAGE_CLASS }),
    });

    return { resources };
  },

  typeDisplay({ store }) {
    return store.getters['type-map/pluralLabelFor'](schema);
  },
};
</script>

<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="Storageclass" name="storageclass">
      <ResourceTable :schema="schema" :rows="resources.storageclass" :headers="headers" />
    </el-tab-pane>
    <el-tab-pane label="Persistentvolume" name="persistentvolume">
      <ResourceTable :schema="schema" :rows="resources.persistentvolume" :headers="headers" />
    </el-tab-pane>
  </el-tabs>
</template>
