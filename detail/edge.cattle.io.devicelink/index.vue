<script>
/* eslint-disable */
import  _ from 'lodash'
import LabelValue from './labelValue';
import createEditView from '@/mixins/create-edit-view';

export default {
  components: {
    LabelValue
  },
  mixins: [createEditView],
  data() {
    const { properties } = this.value.spec.template.spec;
    const rows = [];
    for(let i = 0; i < properties.length; i++) {
      const obj = this.flatterObject(properties[i])
      rows.push(obj);
    }
    return { 
      activeName: 'second',
      rows,
      properties
    };
  },
  computed: {
    
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    flatterObject(obj) {
      const keys = Object.keys(obj);
      console.log(keys, 'keys');
      let row = {};
      keys.forEach( key => {
        if(typeof obj[key] !== 'object') {
          row[key] = obj[key];
        } else {
          const keyValue = this.flatterObject(obj[key])
          row = { ...row, ...keyValue }
        }
      })
      return row
    }
  }
};
</script>

<template>
  <div>
    <el-card class="baseInfo">
      <el-row>
        <el-col :span="12">
          <LabelValue label="名称" :value="this.value.metadata.name" />
        </el-col>
        <el-col :span="12">
          <LabelValue label="命名空间" :value="this.value.metadata.namespace" />
        </el-col>
        <el-col :span="12">
          <LabelValue label="创建时间" :value="this.value.metadata.creationTimestamp" />
        </el-col>
        <el-col :span="12">
          <LabelValue label="apiVersion" :value="this.value.spec.model.apiVersion" />
        </el-col>
        <el-col :span="12">
          <LabelValue label="kind" :value="this.value.spec.model.kind" />
        </el-col>
        <el-col :span="12">
          <LabelValue label="node" :value="this.value.status.adaptor.node" />
        </el-col>
      </el-row>
    </el-card>

    <el-card class="statusInfo">
      <div>Status</div>
      <el-row>
        <el-col :span="12" v-for="item in this.value.status.conditions" :key="item.type">
          <LabelValue :label="item.type" :value="item.status" />
        </el-col>
      </el-row>
    </el-card>

    <el-card class="configuration">
      <el-row>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="设备属性" name="second">
            <el-table
              :data="properties"
              style="width: 100%"
            >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="类型">
                      <span>{{ props.row.name }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="name"
                width="180">
              </el-table-column>
              <el-table-column
                prop="description"
                label="description"
              >
              </el-table-column>
              <el-table-column
                prop="accessMode"
                label="accessMode"
                width="180">
              </el-table-column>
              <el-table-column
                prop="visitor.characteristicUUID"
                label="UUID"
                width="280">
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="访问配置" name="third">
            <template v-if="this.value.spec.model.kind === 'BluetoothDevice'">
              <LabelValue label="设备名称" :value="this.value.spec.template.spec.name" />
            </template>
          </el-tab-pane>
          <el-tab-pane label="标签" name="fourth">
            标签4
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.baseInfo, .statusInfo {
  margin: 20px 0;
}
</style>