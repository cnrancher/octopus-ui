<script>
import _ from 'lodash';
import {
  STATE, AGE, NAMESPACE, NAME, TYPE, WORKLOAD_ENDPOINTS
} from '@/config/table-headers';
import SortableTable from '@/components/SortableTable';
import { DEVICE_TEMPLATE, SCHEMA } from '@/config/types';
import { allHash } from '@/utils/promise';

const schema = {
  id:         'template',
  type:       SCHEMA,
  attributes: {
    kind:       'Template',
    namespaced: true
  },
  metadata: { name: 'template' },
};

export default {
  name:       'ListTemplate',
  components: { SortableTable },

  props: {
    resources: {
      type:    Object,
      default: null,
    },
  },

  async asyncData({ store }) {
    const resources = await allHash({
      reviosn:  store.dispatch('cluster/findAll', { type: DEVICE_TEMPLATE.REVISION }),
      template: store.dispatch('cluster/findAll', { type: DEVICE_TEMPLATE.TEMPLATE }),
    });

    return { resources };
  },

  computed: {
    schema() {
      return schema;
    },

    headers() {
      return [
        STATE,
        NAME,
        {
          ...TYPE,
          width: 300
        },
        {
          name:      'version',
          labelKey:  'tableHeaders.version',
          value:     'spec.displayName',
          sort:      'spec.displayName',
        },
        {
          name:      'defaultRevisionName',
          value:     'spec.defaultRevisionName',
          label:     '默认修订',
          sort:       ['spec.defaultRevisionName'],
          formatter: 'FormatTemplateVersion',
        },
        NAMESPACE,
        AGE,
      ];
    },

    rows() {
      const out = [];
      const template = this.resources.template;

      for ( const typeRows of template ) {
        const templateName = typeRows.metadata.name;

        out.push(typeRows);
        typeRows.customId = templateName;

        for ( const row of [...this.resources.reviosn] ) {
          if (row.spec.deviceTemplateName === templateName) {
            row.customId = templateName;
            out.push(row);
          }
        }
      }

      return out;
    },

    groupBy() {
      return 'customId';
    },
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
    :schema="schema"
    key-field="_key"
    v-on="$listeners"
  >
    <template #group-by="{group}">
      <tr class="group-row">
        <td :colspan="4">
          <div class="group-tab">
            设备模版: ({{ group.ref }})
          </div>
        </td>
      </tr>
    </template>

    <template #group-by="{group}">
      <tr class="group-row">
        <td :colspan="4">
          <div class="group-tab">
            设备模版: ({{ group.ref }})
          </div>
        </td>
      </tr>
    </template>
  </SortableTable>
</template>
