<script>
import _ from 'lodash';
import catalogHeader from './header';
import { CATALOGS, HELM } from '@/config/types';

export default {
  components: {
    catalogHeader
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
      this.$router.push('./mqtt-management/catalog');
    },
    handermanage() {
      this.$router.push('./mqtt-management/catalog-config')
    }
  },
  mounted() {
    console.log('---log', this.helmChart.length)
    if ( this.helmChart.length ===0 ) {
      this.$router.replace('./mqtt-management/catalog')
    }
  },
  async asyncData({ store, route }) {

    const catalogs = await store.dispatch('deviceLink/findAll', { type: CATALOGS, opt:  { url: `${CATALOGS}s` } });
    const helmChart = await store.dispatch('deviceLink/findAll', { type: HELM, opt:  { url: `${HELM}s` } });
    console.log('----log', catalogs)
    return {
      catalogs,
      helmChart,
    }
  }
}
</script>

<template>
  <div id="mqtt">
    <catalogHeader>
      <template v-slot:name>
        应用列表
      </template>

      <template v-slot:action>
        <el-button class="refresh" type="primary" icon="el-icon-setting" @click="handermanage">管理</el-button>
        <el-button class="refresh" type="primary" @click="lanuch">启动</el-button>
      </template>
    </catalogHeader>

    <div class="cardList">
      <div class="title">
        <div class="name">Catalog</div>
        <div class="fold">折叠</div>
      </div>

      <el-row :gutter="30">
        <el-col
          class="card"
          v-for="(item, key) in helmChart"
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
                <div class="name">name</div>
                <div class="version">
                  <div class="upgrade">升级</div>
                  <el-tag type="success">Active</el-tag>
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
  header {
    display: flex;

    .name {
      flex: 1;
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: 500;
    }
    
    .refresh {
      margin-right: 30px;
      width: 80px;
    }

    .search {
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
