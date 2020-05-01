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
      search: '',
    }
  },

  methods: {
    defaultImg() {
      return require(`static/device-default.png`);
    }
  },
  async asyncData(ctx) {
    const { route, store } = ctx;

    const catalogs = await store.dispatch('deviceLink/findAll', { type: CATALOGS, opt:  { url: `${CATALOGS}s` } });
    const helmChart = await store.dispatch('deviceLink/findAll', { type: HELM, opt:  { url: `${HELM}s` } });
    const list = catalogs[0].spec.indexFile.entries;

    return {
      catalogs: list,
      helmChart
    };
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
        <el-button class="refresh" type="primary" icon="el-icon-refresh-left">刷新</el-button>
        <el-input v-model="search" placeholder="搜索"></el-input>
      </template>
    </catalogHeader>
    
    <div class="cardList">
      <div class="title">
        <div class="name">Catalog</div>
        <div class="fold">折叠</div>
      </div>

      <div class="list">
        <el-row :gutter="30">
          <el-col
            class="card"
            :xs="24"
            :sm="24"
            :md="12"
            :lg="8"
            :xl="6"
            v-for="(item, key)  in catalogs"
            :key="key"
          >
            <nuxt-link :to="{path: 'launch', query: { app: key }}">
              <el-card>
                <div class="brand">
                  <img
                    v-real-img="item[0].icon"
                    :src="defaultImg()"
                  />
                </div>

                <el-divider></el-divider>
                
                <div class="name">{{ key }}</div>
              </el-card>
            </nuxt-link>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#mqtt {
  .refresh {
    width: 80px;
    margin-right: 20px;
  }

  .cardList {
    .title {
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      font-size: 15px;
      font-weight: 500;

      .fold {
        color: blue;
        cursor: pointer;
      }
    }

    .card {
      margin-bottom: 20px;

      .brand {
        display: flex;
        justify-content: center;

        img {
          width: 40px;
          height: 40px;
        }
      }
      .name {
        text-align: center;
      }
    }
  }
}
</style>
