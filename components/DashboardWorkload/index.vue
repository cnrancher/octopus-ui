<script>
import LoadDeps from '@/mixins/load-deps';
import { formatCPUValue, formatMemoryValue } from '@/utils/units';
import { allHash } from '@/utils/promise';
import { METRIC } from '@/config/types';
import DashboardProgressBar from './DashboardProgressBar';

function formatBarData(array) {
  let max;
  const sortArray = array.sort((leftItem, rightItem) => rightItem.value - leftItem.value).splice(0, 10);

  return sortArray.map((item, index) => {
    let percent = 0;

    if (index === 0) {
      percent = 100;
      max = item.value;
    } else {
      percent = item.value / max * 100;
    }

    return {
      ...item, value: item.value.toFixed(1), percent
    };
  });
}

export default {
  name:       'DashboardWorkload',
  components: { DashboardProgressBar },
  mixins:     [LoadDeps],

  data() {
    return {
      podsLoadInfo:   [],
      fetchDataTimer: null
    };
  },

  computed: {
    cpuLoadList() {
      const cpuList = this.podsLoadInfo.map((podItem, podIndex) => {
        const cpu = formatCPUValue(podItem.containers[0].usage.cpu);
        const cpuUsage = parseFloat((cpu / 1000 / 1000).toFixed(2)); // 换算m

        return {
          id:    podIndex,
          name:  podItem.id,
          value: cpuUsage
        };
      });

      return formatBarData(cpuList);
    },
    memoryLoadList() {
      const memoryList = this.podsLoadInfo.map((podItem, podIndex) => {
        const memory = formatMemoryValue(podItem.containers[0].usage.memory);
        const memoryUsage = parseFloat((memory / 1024).toFixed(2)); // 换算m

        return {
          id:    podIndex,
          name:  podItem.id,
          value: memoryUsage
        };
      });

      return formatBarData(memoryList);
    }
  },
  beforeDestroy() {
    clearTimeout(this.fetchDataTimer);
  },

  methods: {
    async loadDeps() {
      // force to fetch new data every time
      const podsLoadInfo = await this.$store.dispatch('management/findAll', { type: METRIC.POD, opt: { force: true } });

      this.podsLoadInfo = podsLoadInfo;
      this.fetchDataTimer = setTimeout(() => {
        this.loadDeps();
      }, 30000);
    },
    forceRefresh() {
      clearTimeout(this.fetchDataTimer);
      this.loadDeps();
    }
  }
};
</script>

<template>
  <div class="balance">
    <h3 class="module-title pl-10">
      <i class="icon iconfont icon-dashboad-workload"></i>
      工作负载
    </h3>
    <div class="progress-item">
      <p class="progress-item-title">
        <span>CPU密集型Pod TOP10<i class="icon iconfont el-icon-refresh-left ml-10" @click="forceRefresh"></i></span>
        <span>单位：M</span>
      </p>
      <DashboardProgressBar
        bar-color="linear-gradient(90deg, #8e79d9, #7c88f2)"
        :list="cpuLoadList"
      />
    </div>
    <div class="progress-item">
      <p class="progress-item-title">
        <span>内存密集型Pod TOP10<i class="icon iconfont el-icon-refresh-left ml-10" @click="forceRefresh"></i></span>
        <span>单位：MiB</span>
      </p>
      <DashboardProgressBar
        bar-color="linear-gradient(90deg, #2891f4, #4d66fe)"
        :list="memoryLoadList"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .balance {
    border: 1px solid #ddd;
    padding: 16px 10px!important;
    .progress-item {
      margin-top: 1.45vw;
      width: 100%;
      .progress-item-title {
        color: var(--module-header-text);
        background: var(--module-header-bg);
        padding: 5px 10px;
        .icon {
          font-size: inherit;
          cursor: pointer;
        }
        span:last-child {
          float: right;
          font-size: 12px;
        }
      }
    }
  }
</style>
