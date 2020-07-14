<script>
import ResourceTable from '@/components/ResourceTable';
import Favorite from '@/components/nav/Favorite';
import { AS_YAML, _FLAGGED } from '@/config/query-params';
import BreadCrumbs from '@/components/BreadCrumbs';
import { insureTranslation } from '@/utils/string';

export default {
  components: {
    ResourceTable,
    Favorite,
    BreadCrumbs
  },

  async asyncData(ctx) {
    const { params, store } = ctx;
    const resource = params.resource;
    const hasListComponent = store.getters['type-map/hasCustomList'](resource);
    const hasEditComponent = store.getters['type-map/hasCustomEdit'](resource);
    const hasHeaderComponent = store.getters['type-map/hasCustomHeader'](resource);
    const schema = store.getters['cluster/schemaFor'](resource);

    let foundData = false;
    let rows;
    let more = {};
    let customTypeDisplay;

    if ( hasListComponent ) {
      // If you provide your own list then call its asyncData
      const importer = store.getters['type-map/importList'](resource);
      const component = (await importer())?.default;

      if ( component?.asyncData ) {
        more = await component.asyncData(ctx);
        foundData = true;
      }

      if ( component?.typeDisplay ) {
        customTypeDisplay = component.typeDisplay(ctx);
      }
    }

    if ( !foundData ) {
      rows = await store.dispatch('cluster/findAll', { type: resource });
    }

    return {
      schema,
      hasListComponent,
      hasHeaderComponent,
      hasEditComponent,
      resource,
      rows,
      customTypeDisplay,
      ...more
    };
  },

  data() {
    const params = { ...this.$route.params };
    const resource = params.resource;

    const formRoute = this.$router.resolve({ name: `${ this.$route.name }-create`, params }).href;

    const query = { [AS_YAML]: _FLAGGED };

    const hasListComponent = this.$store.getters['type-map/hasCustomList'](resource);
    const hasHeaderComponent = this.$store.getters['type-map/hasCustomHeader'](resource);
    let listComponent;
    let headerComponent;

    if ( hasListComponent ) {
      listComponent = this.$store.getters['type-map/importList'](resource);
    }

    if ( hasHeaderComponent ) {
      headerComponent = this.$store.getters['type-map/importHeader'](resource);
    }

    const yamlRoute = this.$router.resolve({
      name: `${ this.$route.name }-create`,
      params,
      query
    }).href;

    return {
      route:   this.$route,
      listComponent,
      headerComponent,
      formRoute,
      yamlRoute,
      AS_YAML,
      FLAGGED: _FLAGGED
    };
  },

  computed:   {
    headers() {
      if ( this.hasListComponent || !this.schema ) {
        // Custom lists figure out their own headers
        return [];
      }

      return this.$store.getters['type-map/headersFor'](this.schema);
    },

    typeDisplay() {
      if ( this.customTypeDisplay ) {
        return this.customTypeDisplay;
      }

      if ( !this.schema ) {
        return '?';
      }

      const originName = this.$store.getters['type-map/pluralLabelFor'](this.schema);
      const translatedName = this.t(`breadCrumbs.${ originName.toLocaleLowerCase() }`);

      return insureTranslation(translatedName, originName);
    },

    isCreatable() {
      return this.$store.getters['type-map/isCreatable'](this.$route.params.resource);
    }
  },
}; </script>

<template>
  <div>
    <header>
      <BreadCrumbs class="breadcrumbs" :route="route" />

      <h2 class="p-20">
        {{ typeDisplay }} <Favorite :resource="resource" />
      </h2>

      <div class="actions p-20">
        <template v-if="hasHeaderComponent">
          <component
            :is="headerComponent"
            v-bind="$data"
            class="ml-20 mr-20 p-20"
          />
        </template>

        <template v-else>
          <nuxt-link
            v-if="schema && isCreatable"
            :to="{path: yamlRoute}"
            tag="button"
            type="button"
            class="btn bg-info"
          >
            <t k="resourceList.head.createFromYaml" />
          </nuxt-link>

          <nuxt-link
            v-if="hasEditComponent && isCreatable"
            :to="{path: formRoute}"
            tag="button"
            type="button"
            class="btn bg-primary ml-10"
          >
            <t k="resourceList.head.create" />
          </nuxt-link>
        </template>
      </div>
    </header>

    <div v-if="hasListComponent">
      <component
        :is="listComponent"
        v-bind="$data"
        class="ml-20 mr-20 p-20 card-box-shadow"
      />
    </div>
    <ResourceTable
      v-else
      :schema="schema"
      :rows="rows"
      :headers="headers"
      class="ml-20 mr-20 p-20 card-box-shadow"
    />
  </div>
</template>

<style lang="scss" scoped>
  .header {
    position: relative;
  }
  H2 {
    position: relative;
    font-size: 30px;
  }
</style>
