<script>
import { NAMESPACE } from '@/config/table-headers';
import SortableTable from '@/components/SortableTable';

export default {
  components: { SortableTable },
  props:      {
    events: {
      type:    Array,
      default: () => []
    }
  },
  computed:   {
    headers() {
      return [
        NAMESPACE,
        {
          name:      'timestamp',
          label:     '事件时间',
          value:     '$["metadata"]["fields"][0]',
          sort:      '$["metadata"]["fields"][0]'
        },
        {
          name:  'type',
          label: '类型',
          value: '$["metadata"]["fields"][1]',
          sort:  '$["metadata"]["fields"][1]'
        },
        {
          name:  'reason',
          label: '原因',
          value: '$["metadata"]["fields"][2]',
          sort:  '$["metadata"]["fields"][2]'
        },
        {
          name:  'resource',
          label: '资源对象',
          value: '$["metadata"]["fields"][3]',
          sort:  '$["metadata"]["fields"][3]'
        },
        {
          name:  'message',
          label: '事件消息',
          value: 'message',
          sort:  'message'
        }
      ];
    }
  }
};
</script>
<template>
  <div class="event">
    <h3 class="module-title mb-20">
      <i class="icon iconfont icon-set"></i>
      集群事件
    </h3>
    <SortableTable
      :headers="headers"
      :rows="events"
      :search="false"
      :table-actions="false"
      :row-actions="false"
      :show-groups="false"
      :paging="false"
      default-sort-by="timestamp"
      key-field="id"
      class="dashboard-event-table"
    />
  </div>
</template>

<style lang="scss" scoped>
  .event {
    width: 100%;
    overflow: auto;
    .dashboard-event-table {
      max-height: 395px;
      overflow-y: auto;
    }
    thead {
      th {
        text-align: center;
      }
    }
    .events-table {
      td {
        color: var(--module-header-text);
        text-align: center;
      }
    }
  }
</style>
