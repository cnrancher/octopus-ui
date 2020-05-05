<script>
import _ from 'lodash';
import catalogHeader from './header';
import ResourceTable from '@/components/ResourceTable';
import { CATALOGS, HELM, SCHEMA } from '@/config/types';

export default {
  components: {
    catalogHeader,
    ResourceTable
  },
  data() {
    return {
      search: '',
      currentValue: {}
    }
  },
  methods: {
    defaultImg() {
      return require(`static/device-default.png`);
    },
    formatter(row, column) {
      return row.address;
    },
    hideModal() {
      this.$store.commit('catalogs/showModelInfo', {
        isShow: false,
        id: ''
      }, { root: true });
    },
    async getCurrentValue() {
      const id = this.$store.state.catalogs.showInfo.id;
      const value = await this.$store.dispatch('deviceLink/find', { type: CATALOGS, id });
      this.currentValue = Object.assign({}, value)
    }
  },
  computed: {
    schema() {
      return this.$store.getters['deviceLink/schemaFor'](SCHEMA);
    },
    headers() {
      const STATE = {
        name:      'state',
        label:     'State',
        value:     'id',
        sort:      ['nameSort'],
        width:     200
      };
      const SCOPE = {
        name:      'scope',
        label:     'Scope',
        value:     'metadata.namespace',
        sort:      ['nameSort'],
        width:     200
      };
      const NAME = {
        name:      'name',
        label:     'Name',
        value:     'metadata.name',
        sort:      ['nameSort'],
        width:     200
      };
      const CATALOG_URL = {
        name:      'catalogUrl',
        label:     'Catalog Url',
        value:     'spec.url',
        sort:      ['nameSort'],
        width:     400
      };
      const BRANCHE = {
        name:      'branch',
        label:     'branch',
        value:     'id',
        sort:      ['nameSort'],
        width:     200
      };
      return [STATE, SCOPE, NAME, CATALOG_URL, BRANCHE];
    },
    isShow() {
      this.getCurrentValue()
      return this.$store.state.catalogs.showInfo.isShow;
    },
  },
  async asyncData({ store, route }) {
    const catalogs = await store.dispatch('deviceLink/findAll', { type: CATALOGS, opt:  { url: `${CATALOGS}s` } });
    const helmChart = await store.dispatch('deviceLink/findAll', { type: HELM, opt:  { url: `${HELM}s` } });

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
   
    <ResourceTable :schema="schema" :rows="catalogs" :headers="headers" />
  
    <nuxt-link to="/mqtt-management" class="back">
      <el-button type="primary">返回</el-button>
    </nuxt-link>

    <el-dialog
      title="编辑应用商店"
      :visible="isShow"
      width="600"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideModal">取 消</el-button>
        <el-button type="primary" @click="hideModal">确 定</el-button>
      </span>
    </el-dialog>
  </div>  
</template>

<style lang="scss" scoped>
.back {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>

<style lang="scss">
#mqtt {
  .el-card__body {
    cursor: pointer;
  }
}
</style>
