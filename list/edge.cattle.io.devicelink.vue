<script>
import ResourceTable from '@/components/ResourceTable';
import {
  DEVICE_STATE, DEVICE_NAME, NAMESPACE, KIND_APIVERSION, PROPERTIES, AGE
} from '@/config/table-headers';

export default {
  name:       'ListDevice',
  components: { ResourceTable },

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
    return { headers: [DEVICE_STATE, DEVICE_NAME, NAMESPACE, KIND_APIVERSION, PROPERTIES, AGE] };
  },
};
</script>

<template>
  <ResourceTable :schema="schema" :rows="rows" :headers="headers" />
</template>
