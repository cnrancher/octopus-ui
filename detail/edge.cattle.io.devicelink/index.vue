<script>
import LabelValue from '@/components/LabelValue';
import SortableTable from '@/components/SortableTable';
import createEditView from '@/mixins/create-edit-view';
import { EVENT, DEVICE_LINK } from '@/config/types';
import { getObjectFlatterChainData } from '@/utils/object';
import { POD_EVENT } from '@/config/table-headers';

export default {
  components: { LabelValue, SortableTable },
  mixins:     [createEditView],

  props:      {
    value: {
      type:    Object,
      default: () => {
        return {};
      }
    }
  },

  async fetch() {
    const { type } = this;
    const deviceList = await this.$store.dispatch('management/findAll', { type });
    const eventList = await this.$store.dispatch('management/findAll', { type: EVENT });

    this.deviceList = deviceList.filter( item => item.id === this.value.id);
    this.eventList = eventList;
  },

  data() {
    const { properties } = this.value.spec.template.spec;
    const rows = [];

    for (let i = 0; i < properties?.length; i++) {
      const obj = this.flatterObject(properties[i]);

      rows.push(obj);
    }

    const {
      spec:     { model: { apiVersion, kind } },
      status:   { nodeHostName },
      metadata: { name, namespace, creationTimestamp }
    } = this.value;

    const type = `devices.edge.cattle.io.${ kind.toLowerCase() }`;

    return {
      name,
      namespace,
      creationTimestamp,
      apiVersion,
      kind,
      node:       nodeHostName,
      activeName: 'second',
      rows,
      properties,
      type,
      deviceList: [],
      eventList:  []
    };
  },

  computed: {
    deviceValue() {
      let out = [];
      const deviceValue = this.deviceList[0]?.status?.properties || this.deviceList[0]?.status;

      if (Array.isArray(deviceValue)) {
        out = deviceValue.map( (O) => {
          return { [O.name]: O.value };
        });
      } else if (typeof deviceValue === 'object') {
        out = getObjectFlatterChainData(deviceValue, []);
      }

      return out;
    },
    headers() {
      return POD_EVENT;
    },
    filterEvent() {
      return this.eventList.filter( (E) => {
        return `devicelink/${ this.value.name }` === E.metadata.fields[3];
      });
    }
  },

  methods: {
    flatterObject(obj) {
      const keys = Object.keys(obj);
      let row = {};

      keys.forEach( (key) => {
        if (typeof obj[key] !== 'object') {
          row[key] = obj[key];
        } else {
          const keyValue = this.flatterObject(obj[key]);

          row = { ...row, ...keyValue };
        }
      });

      return row;
    }
  },
};
</script>

<template>
  <div>
    <el-card class="baseInfo">
      <div class="title">
        基础信息
      </div>
      <el-row>
        <el-col :span="12">
          <LabelValue label="名称" :value="name" />
        </el-col>
        <el-col :span="12">
          <LabelValue label="命名空间" :value="namespace" />
        </el-col>
        <el-col :span="12">
          <LabelValue label="创建时间" :value="creationTimestamp" />
        </el-col>
        <el-col :span="12">
          <LabelValue label="apiVersion" :value="apiVersion" />
        </el-col>
        <el-col :span="12">
          <LabelValue label="kind" :value="kind" />
        </el-col>
        <el-col :span="12">
          <LabelValue label="node" :value="node" />
        </el-col>
      </el-row>
    </el-card>

    <el-card class="statusInfo">
      <div class="title">
        上报属性
      </div>
      <el-row v-for="(item, index) in deviceValue" :key="index" :span="12">
        <el-col v-for="(v, k) in item" :key="k" :span="12">
          <LabelValue :label="k" :value="v" />
        </el-col>
        <el-col :span="24">
          <el-divider></el-divider>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="configuration">
      <el-row>
        <el-tabs v-model="activeName">
          <el-tab-pane label="设备属性" name="second">
            <el-table
              :data="properties"
              style="width: 100%"
            >
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <template v-if="value.spec.model.kind === 'BluetoothDevice'">
                    <template v-if="properties[scope.$index].accessMode === 'NotifyOnly'">
                      <div class="center">
                        无相关属性配置
                      </div>
                    </template>
                    <template v-else-if="properties[scope.$index].accessMode === 'ReadOnly'">
                      <el-row>
                        <el-col v-for="(v, k) in properties[scope.$index].visitor.dataConverter" :key="k" :span="12">
                          <template v-if="typeof properties[scope.$index].visitor.dataConverter[k] !== 'object'">
                            <LabelValue :label="k" :value="v" />
                          </template>
                        </el-col>
                      </el-row>
                      <div class="header">
                        orderOfOperations
                      </div>
                      <el-row>
                        <template v-for="(item, index) in properties[scope.$index].visitor.dataConverter.orderOfOperations">
                          <el-col :key="index" :span="12">
                            <LabelValue :label="item.operationType" :value="item.operationValue" />
                          </el-col>
                        </template>
                      </el-row>
                    </template>
                    <template v-else>
                      <el-row>
                        <el-col v-for="(v, k) in properties[scope.$index].visitor.dataConverter" :key="k" :span="12">
                          <template v-if="typeof properties[scope.$index].visitor.dataConverter[k] !== 'object'">
                            <LabelValue :label="k" :value="v" />
                          </template>
                        </el-col>
                        <el-col :span="12">
                          <LabelValue label="defaultValue" :value="properties[scope.$index].visitor.defaultValue" />
                        </el-col>
                      </el-row>
                      <div class="header">
                        orderOfOperations
                      </div>
                      <el-row>
                        <template v-for="(item, index) in properties[scope.$index].visitor.dataConverter.orderOfOperations">
                          <el-col :key="index" :span="12">
                            <LabelValue :label="item.operationType" :value="item.operationValue" />
                          </el-col>
                        </template>
                      </el-row>
                    </template>
                  </template>
                  <template v-if="value.spec.model.kind === 'ModbusDevice'">
                    <el-row>
                      <el-col :span="12">
                        <LabelValue label="readOnly" :value="properties[scope.$index].readOnly" />
                      </el-col>
                      <el-col :span="12">
                        <LabelValue label="value" :value="properties[scope.$index].value" />
                      </el-col>
                      <el-col v-for="(v, k) in properties[scope.$index].visitor" :key="k" :span="12">
                        <template v-if="typeof properties[scope.$index].visitor[k] !== 'object'">
                          <LabelValue :label="k" :value="v" />
                        </template>
                      </el-col>
                    </el-row>
                  </template>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="名称"
                width="180"
              >
              </el-table-column>
              <el-table-column
                prop="description"
                label="描述"
              >
              </el-table-column>
              <el-table-column
                prop="accessMode"
                label="访问模式"
                width="180"
              >
              </el-table-column>
              <el-table-column
                prop="visitor.characteristicUUID"
                label="UUID"
                width="280"
              >
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="访问配置" name="third">
            <template v-if="kind === 'BluetoothDevice'">
              <LabelValue label="设备名称" :value="value.spec.template.spec.name" />
            </template>

            <template v-if="kind === 'ModbusDevice'">
              <template v-for="(v, k) in value.spec.template.spec.protocol.rtu">
                <el-col :key="k" :span="12">
                  <LabelValue :label="k" :value="v" />
                </el-col>
              </template>
              <template v-for="(v, k) in value.spec.template.spec.protocol.tcp">
                <el-col :key="k" :span="12">
                  <LabelValue :label="k" :value="v" />
                </el-col>
              </template>
            </template>
          </el-tab-pane>
          <el-tab-pane label="标签" name="fourth">
            <template v-if="value.spec.template && value.spec.template.metadata &&value.spec.template.metadata.labels">
              <template v-for="(v, k) in value.spec.template.metadata.labels">
                <el-col :key="k" :span="12">
                  <LabelValue :label="k" :value="v" />
                </el-col>
              </template>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-card>

    <el-card class="statusInfo">
      <div class="title">
        状态
      </div>
      <el-row>
        <el-col v-for="item in value.status.conditions" :key="item.type" :span="12">
          <LabelValue :label="item.type" :value="item.status" />
        </el-col>
      </el-row>
    </el-card>

    <el-card class="statusInfo">
      <div class="title">
        事件
      </div>
      <el-row>
        <SortableTable
          :headers="headers"
          :rows="filterEvent"
          :search="false"
          :table-actions="false"
          :row-actions="false"
          :show-groups="false"
          :paging="false"
          default-sort-by="timestamp"
          key-field="id"
          class="dashboard-event-table"
        />
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
