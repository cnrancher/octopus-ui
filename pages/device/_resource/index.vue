<script>
/* eslint-disable */
import _ from 'lodash'
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
  asyncData({ store, error }) {
    return store.dispatch('deviceLink/findAll', { type: DEVICE_LINK, opt: { url: `${DEVICE_LINK}s` } }).then((rows) => {
      return {
        rows
      };
    }).catch(e => {
      error({ statusCode: '404', message: 'DeviceLink CRD对象不存在, 请先部署DeviceLink.' })
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

        <nuxt-link
          :to="{path: yamlRoute}"
          tag="button"
          type="button"
          class="btn bg-primary"
        >
          Create as Yaml
        </nuxt-link>
      </div>
    </header>
    <ResourceTable :schema="schema" :rows="rows" :headers="headers" />
  </div>
</template>

<style lang="scss" scoped>
  .actions {
    margin-bottom: 30px;
    display: flex;
    justify-content: flex-end;

    .btn {
      margin-left: 20px;
    }
  }
</style>
