<script>
import { STATE, AGE, NAMESPACE_NAME, TYPE } from '@/config/table-headers';
import SortableTable from '@/components/SortableTable';
import {
  CATALOG, HELM, WORKLOAD_TYPES, SERVICE, DEVICE_PROTOCOL, SCHEMA
} from '@/config/types';
import { deviceDefaultInfo } from '@/config/map';
import { allHash } from '@/utils/promise';

const schema = {
  id:         'helm.cattle.io.helmchart',
  type:       SCHEMA,
  attributes: {
    kind:       'helm.cattle.io.helmchart',
    namespaced: true
  },
  metadata: { name: 'helm.cattle.io.helmchart' },
};

export default {
  name:       'Application',
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
      deployment:  store.dispatch('management/findAll', { type: WORKLOAD_TYPES.DEPLOYMENT, opt: { force: true } }),
      daemonSet:   store.dispatch('management/findAll', { type: WORKLOAD_TYPES.DAEMON_SET, opt: { force: true } }),
      statefulSet: store.dispatch('management/findAll', { type: WORKLOAD_TYPES.STATEFUL_SET, opt: { force: true } }),
      batchJob:    store.dispatch('management/findAll', { type: WORKLOAD_TYPES.JOB, opt: { force: true } }),
      service:     store.dispatch('management/findAll', { type: SERVICE, opt: { force: true } }),
      helm:        store.dispatch('management/findAll', { type: HELM, opt: { force: true } }),
      catalogs:    store.dispatch('management/findAll', { type: CATALOG, opt: { force: true } })
    });

    return { resources };
  },

  data() {
    return {};
  },

  computed: {
    schema() {
      return schema;
    },

    headers() {
      return [
        STATE,
        {
          ...NAMESPACE_NAME,
          width: 300
        },
        {
          ...TYPE,
          width: 200
        },
        {
          name:      'service',
          label:     'Service',
          formatter: 'Service',
          value:     "$['metadata']['annotations']['field.cattle.io/publicEndpoints']"
        },
        AGE,
      ];
    },

    rows() {
      const out = [];
      const helm = this.resources.helm;

      for (const typeRows of helm) {
        const name = typeRows.metadata.name;
        const { chart, targetNamespace } = typeRows.spec;
        const id = typeRows.id;

        typeRows.customId = id;
        out.push(typeRows);

        for (const row of [...this.resources.statefulSet, ...this.resources.daemonSet, ...this.resources.deployment, ...this.resources.batchJob, ...this.resources.service]) {
          if ( row.metadata.namespace === targetNamespace && row.metadata?.labels?.['app.kubernetes.io/instance'] === name && row.metadata?.labels['app.kubernetes.io/name'] === chart) {
            row.customId = id;
            out.push(row);
          }
        }
      }

      return out;
    },

    groupBy() {
      return 'customId';
    },

    entries() {
      const entries = {};

      this.resources.catalogs.forEach( (C) => {
        const url = C.spec?.url;

        entries[url] = C.spec.indexFile;
      });

      return entries;
    }
  },

  methods: {
    getVersion(group) {
      const helm = group.rows.find( (row) => {
        return row.kind === 'HelmChart';
      });
      const { version, chart, repo } = helm.spec;
      const versions = _.sortBy(this.entries[repo]?.entries?.[chart] || [], (C) => {
        return -C.version;
      });

      if (version === versions?.[0]?.version) {
        return true;
      }

      return false;
    }
  },

  typeDisplay({ store }) {
    return store.getters['type-map/pluralLabelFor'](schema);
  },
};
</script>

<template>
  <SortableTable
    v-bind="$attrs"
    :headers="headers"
    :rows="rows"
    :group-by="groupBy"
    :paging="true"
    key-field="_key"
    v-on="$listeners"
  >
    <template #group-by="{group}">
      <tr class="group-row">
        <td :colspan="4">
          <div class="group-tab">
            {{ group.ref }} <span class="version ml-20">{{ getVersion(group) ? '' : '有新版本可更新' }}</span>
          </div>
        </td>
      </tr>
    </template>
  </SortableTable>
</template>

<style lang="scss" scoped>
.version {
  color: red !important;
}
</style>
