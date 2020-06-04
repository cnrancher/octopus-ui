<script>
import CatalogHeader from './header';
import DefalutImg from '@/components/DefaultImg';
import { CATALOG, HELM } from '@/config/types';
import { filterObj } from '@/utils/object';

export default {
  components: {
    CatalogHeader,
    DefalutImg
  },

  data() {
    return { search: '' };
  },

  computed: {
    newCatalogs() {
      return filterObj(this.catalogs, [this.search], true);
    }
  },

  async asyncData(ctx) {
    const { route, store } = ctx;

    const catalogs = await store.dispatch('management/findAll', { type: CATALOG });
    const helmChart = await store.dispatch('management/findAll', { type: HELM });
    const list = catalogs[0].spec.indexFile.entries;

    return {
      catalogs: list,
      helmChart
    };
  },

  methods: {
    defaultImg() {
      return require(`static/device-default.png`);
    },
    async handlerRefresh() {
      this.$nuxt.$loading.start();

      const data = await this.$store.dispatch('management/findAll', {
        type: CATALOG,
        opt:  {
          url:   `${ CATALOG }s/kube-system/mqtt-library?action=refresh`,
          force: true
        }
      });

      this.$nuxt.$loading.finish();
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
        <el-button class="refresh" type="primary" icon="el-icon-refresh-left" @click="handlerRefresh">
          刷新
        </el-button>
        <el-input v-model="search" placeholder="搜索"></el-input>
      </template>
    </CatalogHeader>

    <div class="cardList">
      <div class="title">
        <div class="name">
          Catalog
        </div>
      </div>

      <div class="list">
        <el-row :gutter="30">
          <el-col
            v-for="(item, key) in newCatalogs"
            :key="key"
            class="card"
            :xs="24"
            :sm="24"
            :md="12"
            :lg="8"
            :xl="6"
          >
            <nuxt-link :to="{path: 'create', query: { app: key, mode: 'create' }}">
              <el-card>
                <div class="brand">
                  <DefalutImg :real="item[0].icon" />
                </div>

                <el-divider></el-divider>

                <div class="name">
                  {{ key }}
                </div>
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
