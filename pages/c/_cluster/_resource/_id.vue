<script>
import ResourceDetail, { watchQuery, asyncData } from '@/components/ResourceDetail';

export default {
  name:       'ClusterResourcedId',
  components: { ResourceDetail },
  asyncData,
  watchQuery,
};
</script>

<template>
  <div class="p-20">
    <ResourceDetail v-bind="$data" />
  </div>
</template>
