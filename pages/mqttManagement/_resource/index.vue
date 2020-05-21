<script>
import _ from 'lodash';
import CatalogHeader from './header';
import StatusBar from '@/components/StatusBar';
import { CATALOGS, HELM, JOB } from '@/config/types';

export default {
  components: { CatalogHeader, StatusBar },
  data() {
    return { search: '' };
  },
  computed: {
    searchHelmChart() {
      return this.helmChart.filter( (chart) => {
        return chart.metadata.name.includes(this.search);
      });
    }
  },
  async asyncData({ store, route }) {
    const catalogs = await store.dispatch('management/findAll', { type: CATALOGS, opt: { url: `${ CATALOGS }s` } });
    const helmChart = await store.dispatch('management/findAll', { type: HELM, opt: { url: `${ HELM }s` } });
    const batchJob = await store.dispatch('management/findAll', { type: JOB, opt: { url: `${ JOB }s` } });

    const filterHelmChart = helmChart.filter((chart) => {
      return chart.metadata?.annotations?.['edgeapi.cattle.io/edge-api-server'] === 'true';
    });
    const comppositonHelmChart = filterHelmChart.map((chart) => {
      chart.chartInfo = catalogs[0].spec.indexFile.entries[chart.spec.chart] || [];

      return chart;
    });

    return {
      catalogs,
      helmChart: comppositonHelmChart,
      batchJob
    };
  },
  mounted() {
    if ( this.helmChart.length === 0 ) {
      this.$router.replace('/mqttManagement/edgeapi.cattle.io.catalog/catalog');
    }
  },
  methods: {
    defaultImg() {
      return require(`static/device-default.png`);
    },
    lanuch() {
      this.$router.push('/mqttManagement/edgeapi.cattle.io.catalog/catalog');
    },
    handermanage() {
      this.$router.push('/mqttManagement/edgeapi.cattle.io.catalog/catalog-config');
    },
    upgradeInfo(chart) {
      const { version } = chart.spec;
      const allVersion = chart.chartInfo.map((C) => {
        return C.version;
      }).sort((a, b) => {
        return (b).localeCompare(a);
      });

      if (version === allVersion[0]) {
        return `已经是最新版本 (${ version })`;
      } else {
        return `有可用更新 (${ allVersion[0] })`;
      }
    },
    getStatus(obj) {
      const job = this.batchJob.filter((JOB) => {
        return JOB.id === `kube-system/${ obj.status.jobName }`;
      });

      return job[0].status.active === 1 ? 'Active' : 'Error';
    },
    getBarStatus(obj) {
      const job = this.batchJob.filter((JOB) => {
        return JOB.id === `kube-system/${ obj.status.jobName }`;
      });

      console.log(job, 'batchJob-----', obj.status.jobName);

      return job[0].status.active === 1 ? 'Success' : 'Error';
    },
    showActions(value, e) {
      this.$store.commit('actionMenu/show', {
        resources: value,
        elem:      e.target,
      });
    },
  },
};
</script>

<template>
  <div id="mqtt" class="p-20">
    <CatalogHeader>
      <template v-slot:name>
        应用列表
      </template>

      <template v-slot:action>
        <el-button class="refresh" type="primary" icon="el-icon-setting" @click="handermanage">
          管理
        </el-button>
        <el-button class="refresh" type="primary" @click="lanuch">
          启动
        </el-button>
      </template>
    </CatalogHeader>

    <div class="cardList">
      <div class="title">
        <div class="name">
          Catalog
        </div>
        <div class="fold">
          折叠
        </div>
      </div>

      <div class="search">
        <el-input v-model="search" placeholder="搜索"></el-input>
      </div>

      <el-row :gutter="30">
        <el-col
          v-for="(chart, key) in searchHelmChart"
          :key="key"
          class="card"
          :xs="24"
          :sm="24"
          :md="12"
          :lg="8"
          :xl="6"
        >
          <div class="catalog-view">
            <div class="catalog-icon">
              <img :src="defaultImg()" alt="">
            </div>
            <div class="catalog-info">
              <div class="info">
                <div class="name">
                  {{ chart.metadata.name }}
                </div>
                <div class="version">
                  <nuxt-link :to="`/mqttManagement/edgeapi.cattle.io.catalog/create?app=${chart.spec.chart}&mode=edit&id=${chart.id}`">
                    {{ upgradeInfo(chart) }}
                  </nuxt-link>
                  <el-tag type="success">
                    {{ getStatus(chart) }}
                  </el-tag>
                  <button ref="actions" type="button" class="btn btn-sm role-multi-action actions" @click="showActions(chart, $event)">
                    <i class="icon icon-actions" />
                  </button>
                </div>
              </div>
              <div class="line"></div>
              <StatusBar :type="getBarStatus(chart)" />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#mqtt {

  .search {
    margin-bottom: 30px;
    display: flex;
    justify-content: flex-end;

    .el-input {
      width: 200px;
    }
  }

  .title {
    display: flex;
    .name {
      flex: 1;
    }
    margin-bottom: 20px;
  }

  .card {
    margin-bottom: 20px;
    min-width: 450px;
  }

  .catalog-view {
    width: 100%;
    height: 120px;
    border: 1px solid #dde4e6;
    display: flex;

    .catalog-icon {
      width: 120px;
      height: 120px;
      border-right: 1px solid #dde4e6;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 80px;
        height: 80px;
      }
    }
    .catalog-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      background-color: #f2f5f5;
      justify-content: center;

      .info {
        display: flex;
        height: 30px;
        padding: 0px 10px;
        .name {
          width: 100px;
          line-height: 30px;
          flex: 1;
        }
        .version {
          display: flex;
          align-items: center;
        }
      }

      .line {
        border-top: 2px solid #dde4e6;
        margin: 10px 10px;
      }
    }
  }
}
</style>
