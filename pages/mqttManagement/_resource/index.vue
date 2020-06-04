<script>
import _ from 'lodash';
import CatalogHeader from './header';
import StatusBar from '@/components/StatusBar';
import ExportPort from '@/components/ExportPort';
import { CATALOG, HELM, WORKLOAD_TYPES, SERVICE } from '@/config/types';
import { allHash } from '@/utils/promise';
import LoadDeps from '@/mixins/load-deps';
export default {
  components: {
    CatalogHeader, StatusBar, ExportPort
  },

  mixins:     [LoadDeps],

  data() {
    return {
      search:      '',
      batchJob:    [],
      deployment:  [],
      daemonSet:   [],
      statefulSet: [],
      service:     []
    };
  },

  computed: {
    searchHelmChart() {
      return this.filterHelmChart.filter( C => C.metadata.name.includes(this.search) );
    },
    filterHelmChart() {
      const { helmChart } = this;
      const filterHelmChart = this.helmChart.filter((chart) => {
        return chart.metadata?.annotations?.['edgeapi.cattle.io/edge-api-server'] === 'true';
      });

      const comppositonHelmChart = filterHelmChart.map((chart) => {
        chart.chartInfo = this.catalogs[0].spec.indexFile?.entries[chart.spec.chart] || [];

        return chart;
      });

      return comppositonHelmChart;
    }
  },

  async asyncData({ store, route }) {
    const catalogs = await store.dispatch('management/findAll', { type: CATALOG, opt: { force: true } });
    const helmChart = await store.dispatch('management/findAll', { type: HELM, opt: { force: true } });

    return {
      catalogs,
      helmChart
    };
  },

  mounted() {
    if ( this.filterHelmChart.length === 0 ) {
      this.$router.replace('/mqttManagement/edgeapi.cattle.io.catalog/catalog');
    }
  },

  updated() {
    if ( this.filterHelmChart.length === 0 ) {
      this.$router.replace('/mqttManagement/edgeapi.cattle.io.catalog/catalog');
    }
  },

  methods: {
    async loadDeps() {
      const hash = await allHash({
        deployment:  this.$store.dispatch('management/findAll', { type: WORKLOAD_TYPES.DEPLOYMENT, opt: { force: true } }),
        daemonSet:   this.$store.dispatch('management/findAll', { type: WORKLOAD_TYPES.DAEMON_SET, opt: { force: true } }),
        statefulSet: this.$store.dispatch('management/findAll', { type: WORKLOAD_TYPES.STATEFUL_SET, opt: { force: true } }),
        batchJob:    this.$store.dispatch('management/findAll', { type: WORKLOAD_TYPES.JOB, opt: { force: true } }),
        service:     this.$store.dispatch('management/findAll', { type: SERVICE, opt: { force: true } }),
      });

      this.batchJob = hash.batchJob;
      this.deployment = hash.deployment;
      this.daemonSet = hash.daemonSet;
      this.statefulSet = hash.statefulSet;
      this.service = hash.service;
    },
    defaultImg() {
      return require(`static/device-default.png`);
    },
    lanuch() {
      this.$router.push('/mqttManagement/edgeapi.cattle.io.catalog/catalog');
    },
    goToManage() {
      this.$router.push('/mqttManagement/edgeapi.cattle.io.catalog/catalog-config');
    },
    upgradeInfo(chart) {
      const { version } = chart.spec;
      const allVersion = _.sortBy(chart.chartInfo, (C) => {
        return -C.version;
      });
      const latestVersion = allVersion[0].version;
      const info = version === latestVersion ? `已经是最新版本` : `有可用更新`;

      return `${ info } ${ latestVersion }`;
    },
    getStatus(obj) {
      return obj.metadata?.state?.name ? 'active' : 'Error';
    },
    getBarStatus(obj) {
      const {
        batchJob, deployment, daemonSet, statefulSet
      } = this;
      const all = [batchJob, deployment, daemonSet, statefulSet];
      const name = obj.metadata.name;
      const { chart, targetNamespace } = obj.spec;
      const out = [];
      const state = 'Success';
      let totalReplicas = 0;
      let totalReadyReplicas = 0;

      for ( const typeRows of all ) {
        if ( !typeRows ) {
          continue;
        }

        for ( const row of typeRows ) {
          if ( row.metadata.namespace === targetNamespace && row.metadata?.labels['app.kubernetes.io/instance'] === name && row.metadata?.labels['app.kubernetes.io/name'] === chart) {
            totalReplicas += row.status.replicas;
            totalReadyReplicas += row.status.readyReplicas;
            out.push(row);
          }
        }
      }

      return {
        num: out.length,
        totalReplicas,
        totalReadyReplicas
      };
    },
    portList(chart) {
      const out = [];
      const { service } = this;
      const instance = chart.metadata.name;
      const { chart: name, targetNamespace: namespace } = chart.spec;

      service.map( (item) => {
        if (
          item.metadata?.labels['app.kubernetes.io/instance'] === instance &&
          item.metadata?.labels['app.kubernetes.io/name'] === name &&
          item.metadata.namespace === namespace
        ) {
          const ports = item.spec.ports;

          if (item.spec.type !== 'ClusterIP') {
            for (const P of ports) {
              out.push({
                port: item.spec.type === 'NodePort' ? P.nodePort : P.port,
                type: P.protocol
              });
            }
          }
        }
      });

      return out;
    },
    showActions(value, e) {
      this.$store.commit('action-menu/show', {
        resources: value,
        elem:      e.target,
      });
    },
  }
};
</script>

<template>
  <div id="mqtt" class="p-20">
    <CatalogHeader>
      <template v-slot:name>
        应用列表
      </template>

      <template v-slot:action>
        <el-button class="refresh" type="primary" icon="el-icon-setting" @click="goToManage">
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
                  <nuxt-link :to="`/mqttManagement/edgeapi.cattle.io.catalog/create?app=${chart.spec.chart}&mode=edit&id=${chart.id}`">
                    {{ chart.metadata.name }}
                  </nuxt-link>
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
              <div class="bar">
                <StatusBar :all-data="getBarStatus(chart)" />
              </div>
              <ExportPort :list="portList(chart)" />
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

      .bar {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
