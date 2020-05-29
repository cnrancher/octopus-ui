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
      search:       '',
      currentValue: {}
    };
  },
  computed: {
    schema() {
      return this.$store.getters['management/schemaFor'](SCHEMA);
    },
    headers() {
      const STATE = {
        name:      'state',
        label:     'State',
        value:     'status',
        sort:      ['nameSort'],
        formatter:  'FormatCatalogState',
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

      return [STATE, SCOPE, NAME, CATALOG_URL];
    },
    isShow() {
      this.getCurrentValue();
      console.log('---this.$store.state.catalogs', this.$store.state.catalogs)
      return this.$store.state.catalogs?.showInfo.isShow;
    },
  },
  async asyncData({ store, route }) {
    const catalogs = await store.dispatch('management/findAll', { type: CATALOGS, opt: { url: `${ CATALOGS }s` } });
    const helmChart = await store.dispatch('management/findAll', { type: HELM, opt: { url: `${ HELM }s` } });
    console.log('请求的结果', catalogs)
    return {
      catalogs,
      helmChart,
    };
  },
  methods: {
    hideModal() {
      this.$store.commit('catalogs/showModelInfo', {
        isShow: false,
        id:     ''
      }, { root: true });
    },
    update(formName) {
      console.log(this, '-----', this.currentValue);
      this.$refs[formName].validate( async(valid) => {
        if (valid) {
          const data = await this.$store.dispatch('management/request', {
            method:  'PUT',
            headers: {
              'content-type': 'application/json',
              accept:         'application/json',
            },
            url:  'v1/edgeapi.cattle.io.catalogs/kube-system/my-mqtt',
            data: this.currentValue,
          });

          if (data._status === 200) {
            this.hideModal();
            this.$nextTick(() => {
              this.$refs[formName].resetFields();
            });
          }
        } else {
          return false;
        }
      });
    },
    async getCurrentValue() {
      const id = this.$store.state.catalogs?.showInfo.id;
      const value = await this.$store.dispatch('management/find', { type: CATALOGS, id });

      this.currentValue = Object.assign({}, value);
    }
  }
};
</script>

<template>
  <div class="catalog-config">
    <catalogHeader>
      <template v-slot:name>
        商店设置
      </template>
    </catalogHeader>

    <ResourceTable :schema="schema" :rows="catalogs" :headers="headers" />

    <nuxt-link to="/mqttManagement/edgeapi.cattle.io.catalog" class="back">
      <el-button type="primary">
        返回
      </el-button>
    </nuxt-link>

    <el-dialog
      title="编辑应用商店"
      :visible="isShow"
      width="600"
    >
      <el-form
        v-if="currentValue.metadata"
        ref="form"
        :model="currentValue"
        class="form-container"
      >
        <el-form-item
          label="名称"
        >
          <el-input v-model="currentValue.metadata.name" disabled></el-input>
        </el-form-item>

        <el-form-item
          label="商店URL地址"
        >
          <el-input v-model="currentValue.spec.url"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideModal">取 消</el-button>
        <el-button type="primary" @click="update('form')">确 定</el-button>
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
