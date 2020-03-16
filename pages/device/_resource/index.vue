<script>
import { SCHEMA, DEVICE_LINK } from '../../../config/types';
import ResourceTable from '@/components/ResourceTable';
import {
  STATE, NAME, DEIVCE_MODEL, DEIVCE_API_VERSION, AGE
} from '@/config/table-headers';
import { headersFor } from '@/utils/customized';
export default {
  components: { ResourceTable },

  data() {
    return {
    }
  },

  computed: {
    schema() {
      return this.$store.getters['deviceLink/schemaFor'](SCHEMA);
    },
    headers() {
      return [STATE, NAME, DEIVCE_MODEL, DEIVCE_API_VERSION, AGE];
    },
  },

  asyncData(ctx) {
    return ctx.store.dispatch('deviceLink/findAll', { type: DEVICE_LINK, opt: { url: DEVICE_LINK } }).then((rows) => {
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
