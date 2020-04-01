<script>
/* eslint-disable */
import { SCHEMA, DEVICE_LINK } from '../../../config/types';
import { EDIT_YAML, _FLAGGED } from '@/config/query-params';
import ResourceTable from '@/components/ResourceTable';
import {
  STATE, NAME, NAMESPACE, KIND_APIVERSION, AGE
} from '@/config/table-headers';
import { importList, pluralLabelFor, headersFor } from '@/utils/customized';

export default {
  components: { ResourceTable },

  data() {
    let listComponent;

    if ( this.hasListComponent ) {
      listComponent = this.$store.getters['type-map/importList'](this.resource);
    }

    const params = { ...this.$route.params };

    const formRoute = this.$router.resolve({ name: `${ this.$route.name }-create`, params }).href;

    const query = { [EDIT_YAML]: _FLAGGED };

    const yamlRoute = this.$router.resolve({
      name: `${ this.$route.name }-create`,
      params,
      query
    }).href;

    return {
      formRoute,
      yamlRoute,
      listComponent,
      EDIT_YAML,
      FLAGGED:       _FLAGGED
    };
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
    return ctx.store.dispatch('deviceLink/findAll', { type: DEVICE_LINK, opt: { url: `${DEVICE_LINK}s` } }).then((rows) => {
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
        <nuxt-link
          :to="{path: yamlRoute}"
          tag="button"
          type="button"
          class="btn bg-primary"
        >
          Create as Yaml
        </nuxt-link>
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
