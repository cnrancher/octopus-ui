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
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    defaultImg() {
      return require(`static/device-default.png`);
    },
    formatter(row, column) {
      return row.address;
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
  <div class="catalog-config">
    <catalogHeader>
      <template v-slot:name>
        Catalogs
      </template>
    </catalogHeader>
   
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort = "{prop: 'date', order: 'descending'}"
      >
      <el-table-column
        prop="date"
        label="日期"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        :formatter="formatter">
      </el-table-column>
    </el-table>
    <nuxt-link to="/mqtt-management">
      <el-button type="primary">返回</el-button>
    </nuxt-link>
  </div>  
</template>

<style lang="scss" scoped>

</style>

<style lang="scss">
#mqtt {
  .el-card__body {
    cursor: pointer;
  }
}
</style>
