<script>
import _ from 'lodash';
import {
  STATE, AGE, NAMESPACE, NAME, TYPE, WORKLOAD_ENDPOINTS
} from '@/config/table-headers';
import SortableTable from '@/components/SortableTable';
import { DEVICE_TEMPLATE } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'ListTemplate',
  components: { SortableTable },

  props: {
    schema: {
      type:     Object,
      required: true,
    },
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

        // out.push(typeRows);
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
