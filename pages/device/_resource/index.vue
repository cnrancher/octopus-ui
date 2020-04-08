<script>
/* eslint-disable */
import _ from 'lodash'
import { SCHEMA, DEVICE_LINK } from '../../../config/types';
import { EDIT_YAML, _FLAGGED } from '@/config/query-params';
import ResourceTable from '@/components/ResourceTable';
import {
  STATE, NAME, NAMESPACE, KIND_APIVERSION, PROPERTIES, AGE
} from '@/config/table-headers';
import { importList, pluralLabelFor, headersFor } from '@/utils/customized';
import { allHash } from '@/utils/promise';

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
      return [STATE, NAME, NAMESPACE, KIND_APIVERSION, PROPERTIES, AGE];
    },
    typeDisplay() {
      return pluralLabelFor(this.schema);
    },
  },
  async asyncData({ store, error }) {
    const { dynamicMenu } = store.state;
    
    const hash = await allHash({
      devicelink: store.dispatch('deviceLink/findAll', { type: DEVICE_LINK, opt: { url: `${DEVICE_LINK}s` } }).then((rows) => {
          return {
            rows
          };
        }).catch(e => {
          error({ statusCode: '404', message: 'DeviceLink CRD对象不存在, 请先部署DeviceLink.' })
        }),
      ...Object.values(dynamicMenu).reduce((all, device) => {
        const type = device.spec.names.kind.toLowerCase();
        const url = `devices.edge.cattle.io.${type}`;
        all[type] = store.dispatch('deviceModel/findAll', { type, opt: { url} });
        return all
      }, {})
    });
    
    return {
      hash
    }
  },
};
</script>

<template>
  <div>
    <header>
      <div class="actions">
        <nuxt-link to="create" append tag="button" type="button" class="btn bg-primary">
          创建
        </nuxt-link>

        <nuxt-link
          :to="{path: yamlRoute}"
          tag="button"
          type="button"
          class="btn bg-primary"
        >
          编辑 Yaml
        </nuxt-link>
      </div>
    </header>
    <ResourceTable :schema="schema" :rows="hash.devicelink.rows" :headers="headers" />
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

    .bg-primary {
      color: #fff;
    }
  }
</style>
