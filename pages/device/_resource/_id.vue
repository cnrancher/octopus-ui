<script>
import ResourceDetail, { watchQuery, asyncData } from '@/components/ResourceDetail';

export default {
  name:       'deviceResourcedId',
  components: { ResourceDetail },
  asyncData,
  watchQuery,
};
</script>

<template>
  <ResourceDetail v-bind="_data" />
</template>
