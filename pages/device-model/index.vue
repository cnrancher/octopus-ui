<script>
import { DUMMY_DEVICE, SCHEMA } from '../../config/types';
import ResourceTable from '@/components/ResourceTable';
import {
  STATE, NAME, NAMESPACE, KIND, AGE
} from '@/config/table-headers';
export default {
  components: { ResourceTable },

  data() {
    return {};
  },

  computed: {
    schema() {
      return this.$store.getters['deviceModel/schemaFor'](SCHEMA);
    },
    headers() {
      return [STATE, NAME, NAMESPACE, KIND, AGE];
    },
  },

  asyncData(ctx) {
    return ctx.store.dispatch('deviceModel/findAll', { type: DUMMY_DEVICE, opt: { url: 'devices.edge.cattle.io.dummydevices' } }).then((rows) => {
      return { rows };
    });
  },
};
</script>

<template>
  <div>
    <ResourceTable :schema="schema" :rows="rows" :headers="headers" />
  </div>
</template>
