<script>
import {
  STATE, AGE, NAMESPACE, NAME, TYPE, WORKLOAD_ENDPOINTS
} from '@/config/table-headers';
import ResourceTable from '@/components/ResourceTable';
import { WORKLOAD_TYPES, SCHEMA, SETTING } from '@/config/types';

const schema = {
  id:         'system.component',
  type:       SCHEMA,
  attributes: {
    kind:       'System.component',
    namespaced: true
  },
  metadata: { name: 'system.component' },
};

export default {
  name:       'ListSystemComponent',
  components: { ResourceTable },

  props: {
    // The things out of asyncData come in as props
    resources: {
      type:    Array,
      default: null,
    },
    allSetting: {
      type:    Array,
      default: null,
    }
  },

  async asyncData({ store }) {
    const types = Object.values(WORKLOAD_TYPES);
    const resources = await Promise.all(types.map((type) => {
      // You may not have RBAC to see some of the types
      if ( !store.getters['cluster/schemaFor'](type) ) {
        return null;
      }

      return store.dispatch('cluster/findAll', { type });
    }));

    const allSetting = await store.dispatch('cluster/findAll', { type: SETTING });

    return { resources, allSetting };
  },

  computed: {
    schema() {
      return schema;
    },

    headers() {
      return [
        STATE,
        TYPE,
        NAMESPACE,
        {
          ...NAME,
          width: ''
        },
        WORKLOAD_ENDPOINTS,
        AGE,
      ];
    },

    rows() {
      const out = [];

      const systemNamespace = this.allSetting.filter( (S) => {
        return S.id === 'system-namespaces';
      })[0]?.default.split(',');

      for ( const typeRows of this.resources ) {
        if ( !typeRows ) {
          continue;
        }

        for ( const row of typeRows ) {
          if ( !row.metadata?.ownerReferences && systemNamespace.includes(row.metadata.namespace)) {
            out.push(row);
          }
        }
      }

      return out;
    }
  },

  typeDisplay({ store }) {
    return store.getters['type-map/pluralLabelFor'](schema);
  },
};
</script>

<template>
  <ResourceTable :schema="schema" :rows="rows" :headers="headers" :ignore-namespace="true" />
</template>
