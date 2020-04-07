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
  <ResourceDetail v-bind="_data" customTitle="CRD" />
</template>
