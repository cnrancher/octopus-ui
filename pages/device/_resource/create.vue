<script>
/* eslint-disable */
import ResourceYaml from '@/components/ResourceYaml';
import { createYaml } from '@/utils/create-yaml';
import { SCHEMA } from '@/config/types';
import { EDIT_YAML, _FLAGGED } from '@/config/query-params';
import { hasCustomEdit, importEdit, singularLabelFor } from '@/utils/customized';

export default {
  components: { ResourceYaml },
  data() {
    if (this.hasCustomEdit) {
      this.$store.getters['type-map/importEdit'](this.resource)().then((component) => {
        this.importedEditComponent = component.default;
      });
    }
    return { importedEditComponent: null };
  },
  computed:   {
    doneRoute() {
      const name = this.$route.name.replace(/create$/, '');
      console.log(name, 'name')
      return 'device-resource';
    },
    hasComponent() {
      return hasCustomEdit(this.resource);
    },
    showComponent() {
      // return this.$store.getters['type-map/importEdit'](this.resource);
      return importEdit(this.resource);
    },
    typeDisplay() {
      return singularLabelFor(this.schema);
    },
    parentLink() {
      const name = this.doneRoute;
      const params = this.$route.params;
      const out = this.$router.resolve({ name, params }).href;
      console.log('parentLink', name, params, out)
      return out;
    },
    doneEditOverride() {
      return this.importedEditComponent?.doneOverride
        ? this.importedEditComponent?.doneOverride.bind(this)
        : null;
    },
  },
  async asyncData(ctx) {
    const { route, store } = ctx;
    const resource = 'edge.cattle.io.devicelink';
    console.log(resource, 'resource');
    const schemas = ctx.store.getters['deviceLink/all'](SCHEMA);
    const schema = ctx.store.getters['deviceLink/schemaFor'](resource);
    const data = { type: resource };
    
    const model = await ctx.store.dispatch('deviceLink/create', data);
    const yaml = createYaml(schemas, resource, data);
    const asYaml = (route.query[EDIT_YAML] === _FLAGGED) || !hasCustomEdit;
    
    return {
      resource, model, yaml, schema, asYaml
    };
  }
};
</script>

<template>
  <ResourceYaml v-if="asYaml" :obj="model" :value="yaml" :done-route="doneRoute" :for-create="true" />
  <div v-else>
    <header>
      <div class="title">
        Add New Device
      </div>
    </header>
    <component
      :is="showComponent"
      :done-route="doneRoute"
      mode="create"
      :value="model"
      :obj="model"
      :yaml="yaml"
      :done-override="doneEditOverride"
    />
  </div>
</template>

<style lang="scss" scoped>
  .title {
    font-size: 24px;
  }
</style>
