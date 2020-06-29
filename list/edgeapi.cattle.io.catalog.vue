<script>
import SortableTable from '@/components/SortableTable';
import { STATE, NAME } from '@/config/table-headers';

export default {
  name:       'ListCatalog',
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

  data() {
    return {};
  },

  computed: {
    headers() {
      return [
        STATE,
        NAME,
        {
          name:      'scope',
          label:     'Scope',
          value:     'metadata.namespace',
          sort:      ['nameSort'],
        },
        {
          name:      'catalogUrl',
          label:     'Catalog Url',
          value:     'spec.url',
          sort:      ['nameSort'],
        }
      ];
    }
  },
};
</script>

<template>
  <SortableTable
    v-bind="$attrs"
    :headers="headers"
    :rows="[...rows]"
    key-field="_key"
    v-on="$listeners"
  >
  </SortableTable>
</template>
