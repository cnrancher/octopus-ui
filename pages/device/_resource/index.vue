<script>
/* eslint-disable */
import { SCHEMA, DEVICE_LINK } from '../../../config/types';
import ResourceTable from '@/components/ResourceTable';
import {
  STATE, NAME, NAMESPACE, KIND_APIVERSION, AGE
} from '@/config/table-headers';
import { importList, pluralLabelFor, headersFor } from '@/utils/customized';

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
      return [STATE, NAME, NAMESPACE, KIND_APIVERSION, AGE];
    },
    typeDisplay() {
      return pluralLabelFor(this.schema);
    },
  },

  asyncData(ctx) {
    return ctx.store.dispatch('deviceLink/findAll', { type: DEVICE_LINK, opt: { url: 'edge.cattle.io.devicelinks' } }).then((rows) => {
      return {
        rows
      };
    });
  },
};
</script>

<template>
  <div>
    <header>
      <div class="actions">
        <nuxt-link to="create" append tag="button" type="button" class="btn bg-primary">
          Create
        </nuxt-link>
      </div>
    </header>
    <ResourceTable :schema="schema" :rows="rows" :headers="headers" />
  </div>
</template>

<style lang="scss" scoped>
  .actions {
    margin-bottom: 30px;
  }
</style>
