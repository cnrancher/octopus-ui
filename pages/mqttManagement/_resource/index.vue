<script>
import _ from 'lodash';
import CatalogHeader from './header';
import { CATALOGS, HELM } from '@/config/types';

export default {
  components: {
    CatalogHeader
  },
  data() {
    return {
      search: ''
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
      this.$router.push('/mqttManagement/edgeapi.cattle.io.catalog/catalog-config')
    },
    upgradeInfo(chart) {
      const { version } = chart.spec;
      const allVersion = chart.chartInfo.map(C => {
        return C.version
      }).sort(function (a, b) {
        return (b).localeCompare(a);
      })
      
      if (version === allVersion[0]) {
        return `已经是最新版本 (${version})`;
      } else {
        return `有可用更新 (${allVersion[0]})`;
      }
    },
    getStatus(obj) {
      return 'Action'
    },
    showActions(value, e) {
      console.log('--------availableActions', value.availableActions)
      this.$store.commit('actionMenu/show', {
        resources: value,
        elem:      e.target,
      });
    },
  },
  computed: {
    searchHelmChart() {
      return this.helmChart.filter( chart => {
        return chart.metadata.name.includes(this.search)
      })
    }
  },
  mounted() {
    if ( this.helmChart.length ===0 ) {
      this.$router.replace('/mqttManagement/edgeapi.cattle.io.catalog/catalog')
    }
  },
  async asyncData({ store, route }) {

    const catalogs = await store.dispatch('deviceLink/findAll', { type: CATALOGS, opt:  { url: `${CATALOGS}s` } });
    const helmChart = await store.dispatch('deviceLink/findAll', { type: HELM, opt:  { url: `${HELM}s` } });
    const filterHelmChart = helmChart.filter(chart => {
      return chart.metadata?.annotations?.['edgeapi.cattle.io/edge-api-server'] === "true"
    })
    const comppositonHelmChart = filterHelmChart.map(chart => {
      chart.chartInfo = catalogs[0].spec.indexFile.entries[chart.spec.chart] || []
      return chart
    })

    return {
      catalogs,
      helmChart: comppositonHelmChart,
    }
  }
}
</script>

<template>
  <div id="mqtt">
    <CatalogHeader>
      <template v-slot:name>
        应用列表
      </template>

      <template v-slot:action>
        <el-button class="refresh" type="primary" icon="el-icon-setting" @click="handermanage">管理</el-button>
        <el-button class="refresh" type="primary" @click="lanuch">启动</el-button>
      </template>
    </CatalogHeader>

    <div class="cardList">
      <div class="title">
        <div class="name">Catalog</div>
        <div class="fold">折叠</div>
      </div>

      <div class="search">
        <el-input v-model="search" placeholder="搜索"></el-input>
      </div>

      <el-row :gutter="30">
        <el-col
          class="card"
          v-for="(chart, key) in searchHelmChart"
          :xs="24"
          :sm="24"
          :md="12"
          :lg="8"
          :xl="6"
          :key="key"
        >
          <div class="catalog-view">
            <div class="catalog-icon">
              <img :src="defaultImg()" alt="">
            </div>
            <div class="catalog-info">
              <div class="info">
                <div class="name">{{ chart.metadata.name }}</div>
                <div class="version">
                  <nuxt-link :to="`/mqttManagement/edgeapi.cattle.io.catalog/create?app=${chart.spec.chart}&mode=edit&id=${chart.id}`">{{upgradeInfo(chart)}}</nuxt-link>
                  <el-tag type="success">{{ getStatus(chart) }}</el-tag>
                  <button ref="actions" type="button" class="btn btn-sm role-multi-action actions" @click="showActions(chart, $event)">
                    <i class="icon icon-actions" />
                  </button>
                </div>
              </div>
              <div class="line"></div>
              <div class="progress"></div>
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

      .progress {
        width: 120px;
        height: 10px;
        border-radius: 5px;
        background-color: red;
        margin-left: auto;
        margin-right: 10px;
      }
    }
  }
}
</style>
