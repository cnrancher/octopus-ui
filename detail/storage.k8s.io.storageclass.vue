<script>
/* eslint-disable */
import { get } from '@/utils/object';
import createEditView from '@/mixins/create-edit-view';
import DetailTop from '@/components/DetailTop';
import LiveDate from '@/components/formatter/LiveDate';
import { DESCRIPTION } from '@/config/labels-annotations';
import ResourceTabs from '@/components/form/ResourceTabs';
import Tab from '@/components/Tabbed/Tab';
import SortableTable from '@/components/SortableTable';
import { PV } from '@/config/types';
import {
  ADDRESS,
  EFFECT,
  IMAGE_SIZE,
  KEY,
  LAST_HEARTBEAT_TIME,
  MESSAGE,
  REASON,
  SIMPLE_NAME,
  SIMPLE_TYPE,
  STATUS,
  VALUE,
  STATE,
  NAME,
  DISPLAY_PVC,
  DISPLAY_SOURCE
} from '@/config/table-headers';

export default {
  name: 'DetailNamespace',

  components: {
    SortableTable,
    DetailTop,
    LiveDate,
    ResourceTabs,
    Tab
  },

  mixins:     [createEditView],

  props: {
    value: {
      type:     Object,
      required: true,
    },
  },

  data() {
    let originalQuotaID = null;
    let description;

    if (!!this.originalValue) {
      originalQuotaID = `${ this.originalValue.metadata.name }/default-quota`;
      const originalAnnotations = get(this.originalValue, 'metadata.annotations');

      if (originalAnnotations) {
        description = originalAnnotations[DESCRIPTION];
      }
      this.value.metadata.annotations = this.originalValue.metadata.annotations ? JSON.parse(JSON.stringify(this.originalValue.metadata.annotations)) : {};
      this.value.metadata.labels = this.originalValue.metadata.labels ? JSON.parse(JSON.stringify(this.originalValue.metadata.labels)) : {};
    }
    if (!this.value.metadata) {
      this.value.metadata = {
        annotations: {},
        labels:      {},
        name:        ''
      };
    }

    if (!this.value.metadata.annotations) {
      this.value.metadata.annotations = {};
    }

    if (!this.value.metadata.labels) {
      this.value.metadata.labels = {};
    }

    return {
      originalQuotaID,
      description,
      name:       this.value.metadata.name,
      pvcHeaders: [
        STATE,
        {
          ...NAME,
          width: 320
        },
        DISPLAY_PVC,
        DISPLAY_SOURCE
      ],
      pvcList: []
    };
  },

  computed: {
    detailTopColumns() {
      const { value } = this;

      return [
        {
          title:   this.$store.getters['i18n/t']('cruStorageClass.provisioner.label'),
          name:    'provisioner',
          content: value.provisioner
        }
      ];
    },
  },
  mounted() {
    this.fetchPvc();
  },
  methods: {
    async fetchPvc() {
      const list = await this.$store.dispatch('cluster/findAll', { type: PV });

      this.pvcList = list;
    }
  }
};
</script>

<template>
  <div class="namespace-detail">
    <DetailTop :columns="detailTopColumns">
      <template v-slot:created>
        <LiveDate :value="value.metadata.creationTimestamp" :add-suffix="true" />
      </template>
    </DetailTop>

    <div class="spacer"></div>

    <ResourceTabs v-model="value" :mode="mode">
      <template #before>
        <Tab name="persistent-volumes" :label="t('cruStorageClass.pv.title')">
          <SortableTable
            key-field="_key"
            :headers="pvcHeaders"
            :rows="pvcList"
            :row-actions="false"
            :table-actions="false"
            :search="true"
          />
        </Tab>
        <Tab name="persistent-parameters" :label="t('cruStorageClass.parameters.title')">
          <SortableTable
            key-field="_key"
            :headers="pvcHeaders"
            :rows="pvcList"
            :row-actions="false"
            :table-actions="false"
            :search="false"
          />
        </Tab>
      </template>
    </ResourceTabs>
  </div>
</template>
