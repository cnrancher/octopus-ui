<script>
/* eslint-disable */
import { NODE } from '@/config/types';
import createEditView from '@/mixins/create-edit-view';
import DetailTop from '@/components/DetailTop';
import ResourceTabs from '@/components/form/ResourceTabs';
import LinkDetail from '@/components/formatter/LinkDetail';
import LiveDate from '@/components/formatter/LiveDate';
import SortableTable from '@/components/SortableTable';
import Networking from '@/components/form/Networking';
import Tab from '@/components/Tabbed/Tab';
import Scheduling from '@/components/form/Scheduling';
import Container from '@/components/form/Container';
import PodSecurity from '@/components/form/PodSecurity';
import Loading from '@/components/Loading';

export default {

  name:       'PodDetail',
  components: {
    DetailTop,
    ResourceTabs,
    LinkDetail,
    LiveDate,
    SortableTable,
    Tab,
    Networking,
    Scheduling,
    Container,
    PodSecurity,
    Loading
  },

  mixins: [createEditView],

  data() {
    return {
      workload: null, node:     null, nodes:    []
    };
  },

  computed:   {
    detailTopColumns() {
      return [
        {
          title: this.t('pod.detailTop.workload'),
          name:  'workload'
        },
        {
          title:   this.t('pod.detailTop.podIp'),
          content: this.value.status.podIP,
          icon: '#icon-ip'
        },
        {
          title: this.t('pod.detailTop.node'),
          name:  'node'
        },
        {
          title:   this.t('pod.detailTop.podRestarts'),
          content: (this.value?.status?.containerStatuses || [])[0]?.restartCount,
          icon:    '#icon-restart'
        },
        {
          title:  this.t('pod.detailTop.created'),
          name:   'created',
          icon:   '#icon-time-create'
        }
      ];
    },

    containerHeaders() {
      return [
        {
          name:      'status',
          label:     this.t('pod.info.tableHeaders.status'),
          value:     'stateDisplay',
          formatter: 'BadgeStateFormatter'
        },
        {
          name:  'name',
          label: this.t('pod.info.tableHeaders.name'),
          value: 'name'
        },
        {
          name:  'image',
          label: this.t('pod.info.tableHeaders.image'),
          value: 'image'
        },
        {
          name:  'imagePullPolicy',
          label: this.t('pod.info.tableHeaders.imagePullPolicy'),
          value: 'imagePullPolicy'
        }
      ];
    },

    containers() {
      return (this.value.spec.containers || []).map((container) => {
        container.status = this.findContainerStatus(container);
        if (container.status) {
          container.stateBackground = this.value.containerStateColor(container.status);
          container.stateDisplay = this.value.containerStateDisplay(container.status);
        }

        return container;
      });
    }
  },

  fetch() {
    this.findWorkload();
    this.findNode();
  },

  methods: {
    // containers are listed in both 'spec.containers' and 'status.containerStatuses', table needs info from each
    findContainerStatus(container) {
      const name = container.name;
      const statuses = this.value?.status?.containerStatuses;

      return (statuses || []).filter(status => status.name === name)[0];
    },

    async findWorkload() {
      const kind = this.value.metadata.ownerReferences[0].kind;
      const uid = this.value.metadata.ownerReferences[0].uid;
      const schema = this.$store.getters['cluster/schema'](kind);

      if (schema) {
        const type = schema.id;
        const allOfResourceType = await this.$store.dispatch('cluster/findAll', { type });

        const resourceInstance = allOfResourceType.filter(resource => resource?.metadata?.uid === uid)[0];

        this.workload = resourceInstance;
      }
    },

    async findNode() {
      const IP = this.value.status.hostIP;

      if (!IP) {
        return null;
      }

      const nodes = await this.$store.dispatch('cluster/findAll', { type: NODE });
      const out = nodes.filter((node) => {
        const { addresses } = node.status;

        return !!addresses.findIndex(obj => obj.address === IP);
      })[0];

      this.nodes = nodes;
      this.node = out;
    }
  }
};
</script>

<template>
  <Loading v-if="$fetchState.pending" />

  <div v-else>
    <DetailTop :columns="detailTopColumns">
      <template #node>
        <LinkDetail v-if="node" :row="node" :value="node.metadata.name" />
      </template>
      <template #workload>
        <LinkDetail v-if="workload" :row="workload" :value="workload.metadata.name" />
      </template>
      <template #created>
        <LiveDate :value="value.metadata.creationTimestamp" :add-suffix="true" />
      </template>
    </DetailTop>

    <div class="row mt-20 p-20 card-box-shadow">
      <SortableTable
        id="container-table"
        :table-actions="false"
        :row-actions="false"
        :search="false"
        :rows="containers"
        key-field="name"
        :headers="containerHeaders"
        :sub-rows="true"
        :sub-expandable="true"
        :sub-expand-column="true"
      >
        <template #sub-row="{row}">
          <tr class="sub-row">
            <td colspan="5">
              <Container class="container-subrow" :value="row" mode="view" />
            </td>
          </tr>
        </template>
      </SortableTable>
    </div>

    <ResourceTabs v-model="value" :mode="mode">
      <template #before>
        <Tab name="networking" label="Networking">
          <Networking class="pl-10" :value="value.spec" mode="view" />
        </Tab>
        <Tab name="scheduling" label="Scheduling">
          <Scheduling class="pl-10" :value="value.spec" mode="view" :nodes="nodes" />
        </Tab>
        <Tab name="security" label="Security">
          <PodSecurity class="pl-10" :value="value.spec" mode="view" />
        </Tab>
      </template>
    </ResourceTabs>
  </div>
</template>

<style>
.container-subrow {
  margin: 20px;
}

#container-table .row-selected{
  background-color: transparent
}
</style>
