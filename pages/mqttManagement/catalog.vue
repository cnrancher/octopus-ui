<script>
/* eslint-disable */
import CatalogHeader from '@/components/AppHeader';
import DefalutImg from '@/components/DefaultImg';
import { CATALOG, HELM } from '@/config/types';
import { filterObj } from '@/utils/object';

export default {
  components: {
    CatalogHeader,
    DefalutImg
  },

  async asyncData(ctx) {
    const { store } = ctx;

    const catalogs = await store.dispatch('management/findAll', { type: CATALOG });
    console.log('----catalogs', catalogs);

    return {
      catalogs,
    };
  },

  data() {
    return { search: '' };
  },

  computed: {
    newCatalogs() {
      let obj = {}
      for (let i in this.catalogs) {
        const catalog = this.catalogs[i];
        const arr = catalog.spec.indexFile?.entries || [];
        const filterCatalog = filterObj(arr, [this.search], true);

        if (Object.keys(filterCatalog).length) {
          obj[catalog.metadata.name] = {
            catalog: filterCatalog,
            namespace: catalog.metadata.namespace,
            name: catalog.metadata.name
          };
        }
      }
      return obj
    }
  },

  methods: {
    defaultImg() {
      return require(`static/generic-catalog.svg`);
    },
    async handlerRefresh() {
      this.$nuxt.$loading.start();

      await this.$store.dispatch('management/findAll', {
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

    <div class="cardList" v-for="(item, key) in newCatalogs" :key="key">
      <div class="title">
        <div class="name">
          {{key}}
        </div>
      </div>

      <div class="list">
        <el-row :gutter="30">
          <el-col
            v-for="(C, key) in item.catalog"
            :key="key"
            class="card"
            :xs="24"
            :sm="24"
            :md="12"
            :lg="8"
            :xl="6"
          >
            <nuxt-link :to="{path: '/c/local/helm.cattle.io.helmchart/create', query: { app: key, name: item.name, namespace: item.namespace }}">
              <el-card>
                <div class="brand">
                  <DefalutImg :real="C[0].icon" :src="defaultImg()" />
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
      
      <el-divider></el-divider>

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
