<script>
import ResourceDetail, { watchQuery, asyncData } from '@/components/ResourceDetail';

export default {
  name:       'DeviceResourcedId',
  components: { ResourceDetail },
  asyncData,
  watchQuery,
};
</script>

<template>
  <div class="p-2p">
    <ResourceDetail v-bind="_data" />
  </div>
</template>
