<script>
import SortableTable from '@/components/SortableTable';
import {
  STATE, NAME, AGE, CAPACITY, CLAIM, RECLAIM_POLICY, ACCESS_MODES, STORAGE_CLASS
} from '@/config/table-headers';
import { mapPref, GROUP_RESOURCES } from '@/store/prefs';
import { removeObject } from '@/utils/array';
import { get } from '@/utils/object';

export default {
  name:       'ListNamespace',
  components: { SortableTable },

  props: {
    schema: {
      type:     Object,
      required: true,
    },

    rows: {
      type:     Array,
      required: true,
    },
  },

  computed: {
    get,

    headers() {
      const out = [
        STATE,
        NAME,
        CAPACITY,
        ACCESS_MODES,
        RECLAIM_POLICY,
        CLAIM,
        STORAGE_CLASS,
        AGE
      ];

      return out;
    },

    pagingParams() {
      return {
        singularLabel: this.$store.getters['type-map/singularLabelFor'](this.schema),
        pluralLabel:   this.$store.getters['type-map/pluralLabelFor'](this.schema),
      };
    },
  },
};
</script>

<template>
  <SortableTable
    v-bind="$attrs"
    :headers="headers"
    :rows="rows"
    :paging="true"
    :paging-params="pagingParams"
    paging-label="sortableTable.paging.resource"
    key-field="_key"
    v-on="$listeners"
  >
  </SortableTable>
</template>
