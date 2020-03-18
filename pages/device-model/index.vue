<script>
import { DUMMY_DEVICE, SCHEMA } from '../../config/types';
import ResourceTable from '@/components/ResourceTable';
import { headersFor } from '@/utils/customized';
import {
  STATE, NAME, NAMESPACE, KIND, AGE
} from '@/config/table-headers';
export default {
  components: { ResourceTable },

  data() {
    return {
    }
  },

  computed: {
    schema() {
      return this.$store.getters['dummyDevice/schemaFor'](SCHEMA);
    },
    headers() {
      return [STATE, NAME, NAMESPACE,KIND, AGE];
    },
  },

   asyncData(ctx) {
    return ctx.store.dispatch('dummyDevice/findAll', { type: DUMMY_DEVICE, opt: { url: DUMMY_DEVICE } }).then((rows) => {
      return {
        rows
      };
    });
  },
};
</script>

<template>
  <div>
    <ResourceTable :schema="schema" :rows="rows" :headers="headers" />
  </div>
</template>
