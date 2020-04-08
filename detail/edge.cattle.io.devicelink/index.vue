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
    let deviceValue = null;
    const deviceType = this.value.spec.model.kind.toLowerCase();
    const { name } = this.value.metadata;
    const list = this.$store.state.deviceModel.types[deviceType]?.list || [];

    const { properties } = this.value.spec.template.spec;
    const rows = [];
    // for(let i = 0; i < properties.length; i++) {
    //   const obj = this.flatterObject(properties[i])
    //   rows.push(obj);
    // }
   
    list.forEach((crd) => {
      if (crd.metadata.name === name) {
        deviceValue = crd.status?.properties[0];
      }
    });

    console.log(properties, 'properties', list, deviceType, name, deviceValue)
    return { 
      activeName: 'second',
      rows,
      properties,
      deviceValue
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
      <div class="title">基础信息</div>
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
      <div class="title">上报属性</div>
      <el-row>
        <el-col :span="12" v-for="(v, k) in deviceValue" :key="k">
          <LabelValue :label="k" :value="v" />
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
              <el-table-column type="expand" >
                <template slot-scope="scope">
                  <template v-if="properties[scope.$index].accessMode === 'NotifyOnly'">
                    <div class="center">无相关属性配置</div>
                  </template>
                  <template v-else-if="properties[scope.$index].accessMode === 'ReadOnly'">
                    <el-row>
                      <el-col :span="12" v-for="(v, k) in properties[scope.$index].visitor.dataConverter" :key="k">
                        <template v-if="typeof properties[scope.$index].visitor.dataConverter[k] !== 'object'">
                          <LabelValue :label="k" :value="v" />
                        </template>
                      </el-col>
                    </el-row>
                    <div class="header">orderOfOperations</div>
                    <el-row>
                      <template v-for="(item, index) in properties[scope.$index].visitor.dataConverter.orderOfOperations">
                        <el-col :span="12"  :key="index">
                          <LabelValue :label="item.operationType" :value="item.operationValue" />
                        </el-col>
                      </template>
                    </el-row>
                  </template>
                  <template v-else>
                    <el-row>
                      <el-col :span="12" v-for="(v, k) in properties[scope.$index].visitor.dataConverter" :key="k">
                        <template v-if="typeof properties[scope.$index].visitor.dataConverter[k] !== 'object'">
                          <LabelValue :label="k" :value="v" />
                        </template>
                      </el-col>
                      <el-col :span="12">
                        <LabelValue label="defaultValue" :value="properties[scope.$index].visitor.defaultValue" />
                      </el-col>
                    </el-row>
                    <div class="header">orderOfOperations</div>
                    <el-row>
                      <template v-for="(item, index) in properties[scope.$index].visitor.dataConverter.orderOfOperations">
                        <el-col :span="12"  :key="index">
                          <LabelValue :label="item.operationType" :value="item.operationValue" />
                        </el-col>
                      </template>
                    </el-row>
                  </template>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="名称"
                width="180">
              </el-table-column>
              <el-table-column
                prop="description"
                label="描述"
              >
              </el-table-column>
              <el-table-column
                prop="accessMode"
                label="访问模式"
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
            <template v-if="this.value.spec.template && this.value.spec.template.metadata &&this.value.spec.template.metadata.labels">
              <template v-for="(v, k) in this.value.spec.template.metadata.labels">
                <el-col :span="12"  :key="k">
                  <LabelValue :label="k" :value="v" />
                </el-col>
              </template>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-card>

    <el-card class="statusInfo">
      <div class="title">状态</div>
      <el-row>
        <el-col :span="12" v-for="item in this.value.status.conditions" :key="item.type">
          <LabelValue :label="item.type" :value="item.status" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.baseInfo, .statusInfo {
  margin: 20px 0;
}
.header {
  margin: 10px;
  font-size: 14px;
  font-weight: bold;
}
.title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}
</style>