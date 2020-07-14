<script>
import { MANAGEMENT } from '@/config/types';
import { insureTranslation } from '@/utils/string';

export default {
  data() {
    // make a map of all route names to validate programatically generated names
    const allRoutes = this.$router.options.routes;
    const allRouteMap = allRoutes.reduce((all, route) => {
      all[route.name] = route;

      return all;
    }, {});
    const { name, params } = this.$route;

    const crumbPieces = name.split('-');

    let crumbLocations = [];

    crumbPieces.forEach((piece, i) => {
      let nextName = piece;

      if (crumbLocations[i - 1]) {
        nextName = ( `${ crumbLocations[i - 1].name }-${ piece }`);
      }
      crumbLocations.push({
        name:   nextName,
        params: this.paramsFor(nextName, params)
      });
    });

    const clusterID = params.cluster;
    let cluster;

    if (clusterID) {
      cluster = this.$store.getters['management/byId']( MANAGEMENT.CLUSTER, clusterID ) || {};
    }

    // remove root route 'c'
    crumbLocations.shift();

    // filter invalid routes
    crumbLocations = crumbLocations.filter((location) => {
      return (allRouteMap[location.name]);
    });

    return {
      crumbLocations, params, crumbPieces, allRouteMap, cluster
    };
  },

  methods: {
    paramsFor(crumbName, params = this.params) {
      const pieces = crumbName.split('-');
      const out = {};

      pieces.forEach((piece) => {
        if (params[piece]) {
          out[piece] = params[piece];
        }
      });

      return out;
    },

    displayName(location, params = this.params) {
      const pieces = location.name.split('-');
      const lastPiece = pieces[pieces.length - 1];
      let src = '';
      let translatedName = '';

      if (lastPiece === 'resource') {
        const resourceType = params[lastPiece];
        const schema = this.$store.getters['cluster/schemaFor'](resourceType);

        if (schema) {
          src = this.$store.getters['type-map/pluralLabelFor'](schema);
        } else {
          src = resourceType;
        }
        translatedName = this.t(`breadCrumbs.${ src.toLocaleLowerCase() }`);
      } else if (lastPiece === 'cluster') {
        src = this.cluster.nameDisplay;
        translatedName = this.t(`breadCrumbs.${ src }`);
      } else {
        translatedName = params[lastPiece];
      }

      return insureTranslation(translatedName, src);
    },
  }
};
</script>

<template>
  <div class="row pl-20 pt-10 pb-10">
    <div v-for="(location, i) in crumbLocations" :key="location.name">
      <template v-if="displayName(location)">
        <span v-if="i > 0" class="divider">/</span>
        <span v-if="i===crumbLocations.length-1">{{ displayName(location) }}</span>
        <nuxt-link v-else :to="location">
          {{ displayName(location) }}
        </nuxt-link>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .row {
    box-shadow: 0 1px 4px 0 var(--border);
    margin-bottom: 0;
    background-color: var(--header-bg);
  }
  .breadcrumbs .divider {
    margin: 0px 5px 0px 5px
  }
</style>
