<script>
import CatalogHeader from './header';
import ResourceTable from '@/components/ResourceTable';
import { CATALOG, NAMESPACE, HELM, SCHEMA } from '@/config/types';

export default {
  components: {
    CatalogHeader,
    ResourceTable
  },
  data() {
    return {
      isEdit:       true,
      search:       '',
      currentValue: {},
      value:        {
        apiVersion: 'edgeapi.cattle.io/v1alpha1',
        kind:       'Catalog',
        metadata:   {
          name:      '',
          namespace: 'kube-system'
        },
        spec: { url: '' }
      }
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
      if (this.$store.state.catalogs?.showInfo.id) {
        this.getCurrentValue();
      }

      return this.$store.state.catalogs?.showInfo.isShow;
    },
  },
  async asyncData({ store, route }) {
    const catalogs = await store.dispatch('management/findAll', { type: CATALOG });
    const helmChart = await store.dispatch('management/findAll', { type: HELM });
    const namespaces = await store.dispatch('management/findAll', { type: NAMESPACE });

    const allNamespace = namespaces?.map( (NS) => {
      return {
        value: NS.id,
        label: NS.id
      };
    });

    return {
      catalogs,
      helmChart,
      allNamespace
    };
  },
  methods: {
    goBack() {
      this.$router.replace('/mqttManagement/edgeapi.cattle.io.catalog');
    },
    addCatalog() {
      this.currentValue = Object.assign({}, this.value);
      this.isEdit = false;
      this.$store.commit('catalogs/showModelInfo', {
        isShow: true,
        id:     ''
      }, { root: true });
    },
    hideModal() {
      this.isEdit = true;
      this.$store.commit('catalogs/showModelInfo', {
        isShow: false,
        id:     ''
      }, { root: true });
    },
    add(formName) {
      this.$refs[formName].validate( async(valid) => {
        if (valid) {
          const data = await this.$store.dispatch('management/request', {
            method:  'post',
            url:    'v1/edgeapi.cattle.io.catalogs',
            data:   this.currentValue,
          });

          if (data._status === 201) {
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
    update(formName) {
      console.log('ths.url', this.currentValue.links.update, this.currentValue.id); // eslint-disable-line no-console
      this.$refs[formName].validate( async(valid) => {
        if (valid) {
          const data = await this.$store.dispatch('management/request', {
            method:  this.isEdit ? 'PUT' : 'POST',
            url:    `v1/edgeapi.cattle.io.catalogs/${ this.currentValue.id }`,
            data:   this.currentValue,
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
      const value = await this.$store.dispatch('management/find', { type: CATALOG, id });

      this.currentValue = Object.assign({}, value);
    }
  },
};
</script>

<template>
  <div class="catalog-config">
    <CatalogHeader>
      <template v-slot:name>
        商店设置
      </template>

      <template v-slot:action>
        <el-button type="primary" @click="addCatalog">
          添加
        </el-button>
      </template>
    </CatalogHeader>

    <ResourceTable :schema="schema" :rows="catalogs" :headers="headers" />

    <div class="back">
      <el-button type="primary" @click="goBack">
        返回
      </el-button>
    </div>

    <el-dialog
      :title="isEdit ? '编辑应用商店' : '添加应用商店'"
      :visible="isShow"
      width="600"
    >
      <el-form
        v-if="currentValue.metadata"
        ref="form"
        :model="currentValue"
        class="form-container"
        label-position="top"
      >
        <el-form-item
          label="名称"
        >
          <el-input v-model="currentValue.metadata.name" :disabled="isEdit"></el-input>
        </el-form-item>

        <el-form-item
          label="命名空间"
        >
          <el-select
            v-model="currentValue.metadata.namespace"
            filterable
            allow-create
            default-first-option
            placeholder="请选择"
          >
            <el-option
              v-for="item in allNamespace"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="商店URL地址"
        >
          <el-input v-model="currentValue.spec.url"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideModal">取 消</el-button>
        <el-button v-if="isEdit" type="primary" @click="update('form')">确 定</el-button>
        <el-button v-else type="primary" @click="add('form')">确 定</el-button>
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
