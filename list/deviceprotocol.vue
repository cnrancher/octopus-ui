<script>
import { STATE, AGE, NAMESPACE_NAME, TYPE } from '@/config/table-headers';
import SortableTable from '@/components/SortableTable';
import { DEVICE_PROTOCOL, SCHEMA } from '@/config/types';
import { deviceDefaultInfo, defaultDevice } from '@/config/map';
import { allHash } from '@/utils/promise';

const schema = {
  id:         'deviceprotocol',
  type:       SCHEMA,
  attributes: {
    kind:       'deviceprotocol',
    namespaced: true
  },
  metadata: { name: 'deviceprotocol' },
};

export default {
  name:       'ListDeviceProtocol',
  components: { SortableTable },

  props: {
    // The things out of asyncData come in as props
    resources: {
      type:    Object,
      default: null,
    },
  },

  data() {
    const { devicesType } = this.$store.state;
    const language = this.$store.getters['i18n/getLanguage'];

    return {
      devicesType,
      defaultDevice,
      language
    }
  },

  methods: {
    defaultImg(kind) {
      const iconUrl = deviceDefaultInfo[kind]?.icon || deviceDefaultInfo.default.icon;
      return require(`static/${ iconUrl }`);
    }
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

    rows() {
      const out = [];
      console.log('---devicesType', this.devicesType, this.resources)
      const custom = this.resources.custom;
      for (const typeDevice of custom) {
        if (typeDevice.metadata.annotations?.['devices.edge.cattle.io/enable'] === 'true') {
          console.log(typeDevice, '----typeDevice')
          typeDevice.customId = typeDevice.spec.names.kind;
          out.push(typeDevice);

          // add daemoset... ...this.resources.daemonset, ...this.resources.deployment, ...this.resources.rbacClusterRolebinding, 
          for (const crd of this.resources.rbacClusterRole) {
            if (crd.metadata.labels?.['app.kubernetes.io/name'] === typeDevice.metadata.labels?.['app.kubernetes.io/name']) {
              crd.customId = typeDevice.spec.names.kind;
              out.push(crd)
            }
          }
        }
      }

      return out;
    },
    groupBy() {
      // The value of the preference is "namespace" but we take that to mean group by project here...
      return 'customId';
    },
  },

  async asyncData({ store }) {
    const resources = await allHash({
      custom:                 store.dispatch('cluster/findAll', { type: DEVICE_PROTOCOL.CUSTOM }),
      daemonset:              store.dispatch('cluster/findAll', { type: DEVICE_PROTOCOL.DAEMONSET }),
      deployment:             store.dispatch('cluster/findAll', { type: DEVICE_PROTOCOL.DEPLOYMENT }),
      rbacClusterRolebinding: store.dispatch('cluster/findAll', { type: DEVICE_PROTOCOL.RBAC_CLUSTERROLEBINDING }),
      rbacClusterRole:        store.dispatch('cluster/findAll', { type: DEVICE_PROTOCOL.RBAC_CLUSTERROLEL }),
    });

    return { resources };
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
  </SortableTable>
</template>
