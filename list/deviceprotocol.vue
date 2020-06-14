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
    kind:       'DeviceProtocol',
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
      language,
    };
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
      const custom = this.resources.custom;

      for (const typeDevice of custom) {
        if (typeDevice.metadata.annotations?.['devices.edge.cattle.io/enable'] === 'true') {
          typeDevice.customId = typeDevice.spec.names.kind;
          out.push(typeDevice);

          // add daemoset... ,
          for (const crd of [...this.resources.rbacClusterRole, ...this.resources.daemonset, ...this.resources.deployment, ...this.resources.rbacClusterRolebinding]) {
            if (crd.metadata.labels?.['app.kubernetes.io/name'] === typeDevice.metadata.labels?.['app.kubernetes.io/name'] && !this.hasInsert(out, crd)) {
              crd.customId = typeDevice.spec.names.kind;
              out.push(crd);
            }
          }
        }
      }

      return out;
    },
    groupBy() {
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

  methods: {
    defaultImg(kind) {
      const iconUrl = deviceDefaultInfo[kind]?.icon || deviceDefaultInfo.default.icon;

      return require(`static/${ iconUrl }`);
    },
    hasInsert(out, crd) {
      return out.find( C => C.metadata.uid === crd.metadata.uid );
    },
    getDeviceInfo(out) {
      let desc = '';
      let icon = '';

      out.forEach( (CRD) => {
        if (CRD.kind === 'CustomResourceDefinition') {
          icon = CRD.metadata.annotations['devices.edge.cattle.io/icon'];
          desc = CRD.metadata.annotations['devices.edge.cattle.io/description'];
        }
      });

      return {
        desc,
        icon
      };
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
    <template #group-header="{group}">
      <tr class="group-row">
        <td :colspan="4">
          <div class="group-tab">
            <img :src="getDeviceInfo(group.rows).icon" alt="" class="deviceImg">
            <div v-tooltip="{content: getDeviceInfo(group.rows).desc, classes: 'tooltipDevice'}" class="name">
              {{ group.ref }} <i class="el-icon-info"></i>
            </div>
          </div>
        </td>
      </tr>
    </template>
  </SortableTable>
</template>

<style lang="scss" scoped>
.deviceImg {
  height: 20px;
}
.group-tab {
  display: flex !important;
  align-items: center;

  img {
    margin-right: 20px;
    margin-top: 0px !important;
  }
  .name {
    display: flex;
    align-items: center;
    i {
      margin-top: 0px !important;
    }
  }
}
</style>

<style lang="scss">
.tooltip.tooltipDevice {
  .tooltip-inner {
    width: 500px !important;
  }
}
</style>
