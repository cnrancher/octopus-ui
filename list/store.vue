<script>
import { STATE, AGE, NAMESPACE_NAME, TYPE } from '@/config/table-headers';
import SortableTable from '@/components/SortableTable';
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
  components: { SortableTable },

  props: {
    // The things out of asyncData come in as props
    resources: {
      type:    Object,
      default: null,
    },
  },

  async asyncData({ store }) {
    const resources = await allHash({
      persistentvolume: store.dispatch('cluster/findAll', { type: STORAGE_CATEGORY.PERSISTENT_VOLUME }),
      storageclass:     store.dispatch('cluster/findAll', { type: STORAGE_CATEGORY.STORAGE_CLASS }),
    });

    return { resources };
  },

  data() {
    return { activeName: this.$route.query.type || 'storageclass' };
  },

  computed: {
    schema() {
      return schema;
    },

    headers() {
      return [
        STATE,
        {
          ...TYPE,
          width: 200
        },
        NAMESPACE_NAME,
        AGE,
      ];
    },
  },

  methods: {
    changeTab() {
      this.$router.push({ query: { type: this.activeName } });
    }
  },

  typeDisplay({ store }) {
    return store.getters['type-map/pluralLabelFor'](schema);
  },
};
</script>

<template>
  <el-tabs v-model="activeName" @tab-click="changeTab">
    <el-tab-pane label="Storageclass" name="storageclass">
      <SortableTable
        v-bind="$attrs"
        :headers="headers"
        :rows="[...resources.storageclass]"
        key-field="_key"
        v-on="$listeners"
      >
      </SortableTable>
    </el-tab-pane>
    <el-tab-pane label="Persistentvolume" name="persistentvolume">
      <SortableTable
        v-bind="$attrs"
        :headers="headers"
        :rows="[...resources.persistentvolume]"
        key-field="_key"
        v-on="$listeners"
      >
      </SortableTable>
    </el-tab-pane>
  </el-tabs>
</template>
