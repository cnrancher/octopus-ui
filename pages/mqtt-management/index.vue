<script>
import _ from 'lodash'
import { CATALOGS } from '@/config/types';

export default {
  data() {
    return {
      search: '',
    }
  },
  methods: {
    defaultImg() {
      return require(`static/device-default.png`);
    },
    handerLaunch(item) {
      console.log('----handerLaunch----', item)
      item.viewEditYaml();
    },
  },
  async asyncData(ctx) {
    const { route, store } = ctx;

    const catalogs = await store.dispatch('deviceLink/findAll', { type: CATALOGS, opt:  { url: `${CATALOGS}s` } });
    console.log(_.cloneDeep(catalogs), '----catalogs');
    const list = catalogs[0].spec.indexFile.entries

    return {
      catalogs: [],
    };
  }
}
</script>

<template>
  <div id="mqtt">
    <header>
      <div class="name">应用列表</div>
      <el-button class="refresh" type="primary" icon="el-icon-refresh-left">刷新</el-button>
      <el-input class="search" v-model="search" placeholder="搜索"></el-input>
    </header>
    <el-divider></el-divider>
    <div class="cardList">
      <div class="title">
        <div class="name">catalogList</div>
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
            <nuxt-link to="launch" append>
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

<style lang="scss">
#mqtt {
  .el-card__body {
    cursor: pointer;
  }
}
</style>
