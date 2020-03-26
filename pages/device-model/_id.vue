<script>
import { PREFIX_DEVICE, SCHEMA } from '../../config/types';
import ResourceTable from '@/components/ResourceTable';
import { NAME, NAMESPACE, KIND, AGE } from '@/config/table-headers';
import { ucFirst } from '@/utils/string';

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
      const headerAttr = [];
      const obj = this.rows[0]?.status;

      for (const key in obj) {
        headerAttr.push({
          name:      key,
          label:     ucFirst(key),
          value:     `status.${ key }`,
          sort:      [`status.${ key }`],
        });
      }

      return [NAME, NAMESPACE, ...headerAttr, KIND, AGE];
    },
  },

  asyncData(ctx) {
    const deviceModel = ctx.route.params.id;
    const type = `${ PREFIX_DEVICE }${ deviceModel }`;
    const url = `${ PREFIX_DEVICE }${ deviceModel }s`;

    return ctx.store.dispatch('deviceModel/findAll', { type, opt: { url } }).then((rows) => {
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
