<script>
import Vue from 'vue';
import _ from 'lodash';
import {
  BLUE_THOOTH_DEVICE,
  MODBUS_DEVICE_RTU,
  MODBUS_DEVICE_TCP,
  OPC_UA_DEVICE,
  customDevice,
} from './defaultYaml';
import { BluetoothDeviceHeader, ModbusDeviceHeader, OPCUADeviceHeader, CUSTOMDeviceHeader } from './type-header';
import { validatorMacAddress, validateIP } from '@/edit/edge.cattle.io.devicelink/rules';
import { allHash } from '@/utils/promise';
import LoadDeps from '@/mixins/load-deps';
import Footer from '@/components/form/Footer';
import KeyValue from '@/components/form/KeyValue';
import AddTable from '@/edit/edge.cattle.io.devicelink/AddTable';
import BluethoothModel from '@/edit/edge.cattle.io.devicelink/BluetoothModel';
import ModbusModel from '@/edit/edge.cattle.io.devicelink/ModbusModel';
import OpcUaModel from '@/edit/edge.cattle.io.devicelink/OpcUaModel';
import CustomModel from '@/edit/edge.cattle.io.devicelink/custom/CustomModel';
import CustomTemplate from '@/edit/edge.cattle.io.devicelink/custom/templates';
import { NODE, NAMESPACES } from '@/config/types';
import { parity, dataBits, deviceDefaultInfo } from '@/config/map';
import createEditView from '@/mixins/create-edit-view';

export default {
  components: {
    AddTable,
    Footer,
    BluethoothModel,
    ModbusModel,
    OpcUaModel,
    CustomModel,
    KeyValue,
    CustomTemplate
  },
  mixins:     [createEditView, LoadDeps],
  data() {
    const { devicesType } = this.$store.state;
    const { mode } = this.$route.query;

    if (this.value.metadata && !(mode === 'edit')) {
      this.$set(this.value, 'spec', _.cloneDeep(BLUE_THOOTH_DEVICE));
    }

    const validateAccessConfig = (rule, value, callback) => {
      if (this.value.spec.template.spec.macAddress && this.value.spec.template.spec.namespace) {
        callback(new Error('name 或 macAddress不能同时为空'));
      } else {
        callback();
      }
    };

    return {
      activeName: 'second',
      isChoose: true,
      deviceDefaultInfo,
      devicesType,
      parity,
      dataBits,
      headers: {
        BluetoothDeviceHeader,
        ModbusDeviceHeader,
        OPCUADeviceHeader
      },
      tempSpec:           {},
      activeNames:        ['1'],
      dialogVisible:      false,
      editRowIndex:       -1,
      allNodes:           [],
      allNamespace:       [],
      templateProtocol:   {},
      templateProperties: {},
      rules:              {
        'metadata.name': [
          { required: true, message: '请输入名称' }
        ],
        'metadata.namespace': [
          { required: true, message: '请输入命名空间' }
        ],
        'spec.adaptor.node': [
          { required: true, message: '请选择节点' }
        ],
        'spec.template.spec.name': [
          { required: true, message: '请输入设备名称' }
        ],
        'spec.template.spec.macAddress': [
          { validator: validateAccessConfig, trigger: 'blur' }
        ],
        'spec.template.spec.protocol.rtu.slaveID': [
          { required: true, message: '请输入SlaveID' }
        ],
        'spec.template.spec.protocol.tcp.slaveID': [
          { required: true, message: '请输入SlaveID' }
        ],
        'spec.template.spec.protocol.tcp.ip': [
          {
            required:  true, validator: validateIP, trigger:   ['blur', 'change']
          }
        ],
        'spec.template.spec.protocol.tcp.port': [
          { required: true, message: '请输入port' }
        ],
      }
    };
  },
  computed: {
    isModeReady() {
      return !!this.value.spec.template.spec.protocol?.tcp || !!this.value.spec.template.spec.protocol?.rtu;
    },
    isCustomProtocol() {
      const deviceProtocol = ['ModbusDevice', 'BluetoothDevice', 'OPCUADevice'];
      const kind = this.value.spec.model.kind;

      return deviceProtocol.includes(kind);
    },
    currentHeader() {
      const kind = this.value.spec.model.kind;

      if (this.isCustomProtocol) {
        const headerName = `${ kind }Header`;

        return this.headers[headerName];
      } else {
        return CUSTOMDeviceHeader;
      }
    },
    transferMode: {
      get() {
        if (this.value.spec.template.spec.protocol?.tcp) {
          return 'tcp';
        } else if (this.value.spec.template.spec.protocol?.rtu) {
          return 'rtu';
        }

        return 'rtu';
      },
      set(v) {
        this.changeTransferMode(v);

        return v;
      }
    },
  },
  methods: {
    enable(buttonCb) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.isChoose && this.value.spec.template.spec.protocol.rtu) {
         
            Vue.delete(this.value.spec.template.spec.protocol.rtu, 'baudRate');
            Vue.delete(this.value.spec.template.spec.protocol.rtu, 'dataBits');
            Vue.delete(this.value.spec.template.spec.protocol.rtu, 'parity');
            Vue.delete(this.value.spec.template.spec.protocol.rtu, 'stopBits');
          }

          this.save(buttonCb);
        } else {
          buttonCb(false);

          return false;
        }
      });
    },
    async loadDeps() {
      const hash = await allHash({
        nodes:      this.$store.dispatch('management/findAll', { type: NODE, opt: { url: NODE } }),
        namespaces:  this.$store.dispatch('management/findAll', { type: NAMESPACES, opt: { url: NAMESPACES } }),
      });
      const nodes = hash.nodes?.map((node) => {
        return {
          value: node.id,
          label: node.id
        };
      });

      const namespaces = hash.namespaces?.map( (NS) => {
        return {
          value: NS.id,
          label: NS.id
        };
      });

      this.allNodes = nodes;
      this.allNamespace = namespaces;
    },
    addAttribute() {
      this.dialogVisible = true;
    },
    hideDialog() {
      this.dialogVisible = false;
      this.editRowIndex = -1;
    },
    addProperties(row) {
      this.value.spec.template.spec.properties.length = 0;
      this.value.spec.template.spec.properties.push(...row);
      this.editRowIndex = -1;
    },
    edit(index) {
      this.editRowIndex = index;
      this.dialogVisible = true;
    },
    deleteRow(index) {
      this.value.spec.template.spec.properties.splice(index, 1);
    },
    changeKind(value) {
      const node = this.value.spec.adaptor.node;
      if (value === 'ModbusDevice') {
        this.$set(this.value, 'spec', _.cloneDeep(MODBUS_DEVICE_RTU));
      } else if (value === 'BluetoothDevice') {
        this.$set(this.value, 'spec', _.cloneDeep(BLUE_THOOTH_DEVICE));
      } else if (value === 'OPCUADevice') {
        this.$set(this.value, 'spec', _.cloneDeep(OPC_UA_DEVICE));
      } else {
        const resource = this.devicesType.filter((D) => {
          if (D.spec.names.kind === value) {
            return D;
          }
        });
        const kind = resource[0].spec.names.kind;
        const spec = resource[0].spec.versions[0].schema.openAPIV3Schema.properties.spec.properties;
        const templateSpec = _.cloneDeep(customDevice);

        templateSpec.adaptor.name = `adaptors.edge.cattle.io/${ kind.toLowerCase() }`;
        templateSpec.model.kind = kind;
        templateSpec.template.spec = spec;
        this.$set(this, 'templateProtocol', _.cloneDeep(spec.protocol));
        this.$set(this, 'templateProperties', _.cloneDeep(spec.properties.items));
        console.log(templateSpec, 'ajax******', resource, spec, spec.protocol); // eslint-disable-line no-console
      }
      this.$set(this.value.spec.adaptor, 'node', node)
    },
    changeTransferMode(mode) {
      const tempSpec = _.cloneDeep(this.value.spec);
      const node = this.value.spec.adaptor.node;
      if (Object.keys(this.tempSpec).length > 0) {
        this.$set(this.value, 'spec', _.cloneDeep(this.tempSpec));
      } else {
        mode === 'rtu'
          ? this.$set(this.value, 'spec', _.cloneDeep(MODBUS_DEVICE_RTU))
          : this.$set(this.value, 'spec', _.cloneDeep(MODBUS_DEVICE_TCP));
      }
      this.$set(this.value.spec.adaptor, 'node', node);
      this.tempSpec = tempSpec;
    },
    getDeviceLabel(device) {
      return deviceDefaultInfo[device.spec.names.kind]?.label || device.spec.names.kind;
    }
  }
};
</script>

<template>
  <div class="form">
    <el-form ref="form" label-position="left" :rules="rules" :model="value" label-width="120px">
      <el-row :gutter="60">

        <el-col :span="12">
          <el-form-item label="名称" prop="metadata.name">
            <el-input v-model="value.metadata.name" :disabled="isEdit"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="命名空间" prop="metadata.namespace">
            <el-select
              v-model="value.metadata.namespace"
              filterable
              allow-create
              default-first-option
              placeholder="请选择"
              :disabled="isEdit"
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
        </el-col>

        <el-col :span="12">
          <el-form-item label="设备类型" required>
            <el-select v-model="value.spec.model.kind" :disabled="isEdit" @change="changeKind">
              <el-option
                v-for="device in devicesType"
                :key="device.spec.names.kind"
                :label="getDeviceLabel(device)"
                :value="device.spec.names.kind"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="节点" prop="spec.adaptor.node">
            <el-select v-model="value.spec.adaptor.node" placeholder="请选择">
              <el-option
                v-for="item in allNodes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-card class="configuration">
            <el-tabs v-model="activeName">
              <el-tab-pane label="访问配置" name="second">
                <template v-if="value.spec.model.kind === 'BluetoothDevice'">
                  <el-col :span="12">
                    <el-form-item key="deviceName" label="蓝牙设备名称" prop="spec.template.spec.name">
                      <el-input v-model="value.spec.template.spec.name"></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item key="macAddress" label="Mac Address" prop="spec.template.spec.macAddress">
                      <el-input v-model="value.spec.template.spec.macAddress"></el-input>
                    </el-form-item>
                  </el-col>
                </template>

                <template
                  v-else-if="value.spec.model.kind === 'ModbusDevice' && value.spec.template.spec.protocol"
                >
                  <el-col :span="12">
                    <el-form-item label="传输模式">
                      <el-radio-group v-model="transferMode" class="subtract">
                        <el-radio-button label="rtu">RTU</el-radio-button>
                        <el-radio-button label="tcp">TCP</el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item v-if="value.spec.template.spec.protocol[transferMode]" :prop="'spec.template.spec.protocol.'+ transferMode +'.slaveID'" label="SlaveID">
                      <el-input v-if="isModeReady" v-model.number="value.spec.template.spec.protocol[transferMode].slaveID"></el-input>
                    </el-form-item>
                  </el-col>

                  <template v-if="transferMode === 'rtu' && isModeReady">
                    <el-col :span="12">
                      <el-form-item v-if="value.spec.template.spec.protocol[transferMode]" key="serialPort" label="串口" required>
                        <el-input v-model="value.spec.template.spec.protocol[transferMode].serialPort"></el-input>
                      </el-form-item>
                    </el-col>

                    <el-col :span="24">
                      <el-checkbox v-model="isChoose">添加RTU高级配置</el-checkbox>
                    </el-col>
                    
                    <template v-if="isChoose">
                      <el-col :span="12">
                        <el-form-item v-if="value.spec.template.spec.protocol[transferMode]" label="baudRate">
                          <el-input v-model.number="value.spec.template.spec.protocol[transferMode].baudRate"></el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item v-if="value.spec.template.spec.protocol[transferMode]" label="dataBits">
                          <el-select v-model.number="value.spec.template.spec.protocol[transferMode].dataBits" clearable>
                            <el-option
                              v-for="item in dataBits"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item v-if="value.spec.template.spec.protocol[transferMode]" label="parity">
                          <el-select v-model="value.spec.template.spec.protocol[transferMode].parity" clearable>
                            <el-option
                              v-for="item in parity"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item v-if="value.spec.template.spec.protocol[transferMode]" label="stopBits">
                          <el-select v-model.number="value.spec.template.spec.protocol[transferMode].stopBits" clearable>
                            <el-option label="1" value="1"></el-option>
                            <el-option label="2" value="2"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </template>
                  </template>

                  <template v-else>
                    <el-col :span="12">
                      <el-form-item v-if="value.spec.template.spec.protocol[transferMode]" label="IP" prop="spec.template.spec.protocol.tcp.ip">
                        <el-input v-if="isModeReady" v-model="value.spec.template.spec.protocol[transferMode].ip"></el-input>
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
                      <el-form-item v-if="value.spec.template.spec.protocol[transferMode]" label="Port" prop="spec.template.spec.protocol.tcp.port">
                        <el-input v-if="isModeReady" v-model.number="value.spec.template.spec.protocol[transferMode].port"></el-input>
                      </el-form-item>
                    </el-col>
                  </template>
                </template>

                <template v-else-if="value.spec.model.kind === 'OPCUADevice' && value.spec.template.spec.protocol">
                  <el-col :span="12">
                    <el-form-item label="URL" required>
                      <el-input v-model="value.spec.template.spec.protocol.url"></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="username">
                      <el-input v-model="value.spec.template.spec.protocol.username"></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="password">
                      <el-input v-model="value.spec.template.spec.protocol.password"></el-input>
                    </el-form-item>
                  </el-col>
                </template>

                <template v-else>
                  <CustomTemplate
                    :key="value.spec.model.kind"
                    :template-protocol="templateProtocol"
                    :value="value"
                  />
                </template>
              </el-tab-pane>

              <el-tab-pane label="设备属性" name="third">
                <el-col :span="24">
                  <span>
                    <i class="el-icon-warning"></i>
                    注意：设备属性会明文展示所输入信息，请不要填入敏感信息，如涉及敏感信息，请先加密，请防止信息泄露。
                  </span>

                  <AddTable
                    :headers="currentHeader"
                    :properties="value.spec.template.spec.properties"
                    @editRow="edit($event)"
                    @deleteRow="deleteRow($event)"
                  />

                  <div class="spacer"></div>

                  <el-button
                    type="primary"
                    icon="el-icon-circle-plus-outline"
                    @click="addAttribute"
                  >
                    新增属性
                  </el-button>
                </el-col>
              </el-tab-pane>

              <el-tab-pane label="设备标签" name="fourth">
                <KeyValue
                  key="labels"
                  v-model="value.spec.template.metadata.labels"
                  :value-multiline="false"
                  :pad-left="false"
                  :as-map="true"
                  value-label="值"
                  key-label="键"
                  :read-allowed="false"
                  add-label="添加设备标签"
                  :protip="false"
                />
              </el-tab-pane>

            </el-tabs>
          </el-card>
        </el-col>

        <el-col :span="24">
          <Footer :mode="mode" :errors="errors" @save="enable" @done="done" />
        </el-col>
      </el-row>
    </el-form>

    <template v-if="dialogVisible">
      <BluethoothModel
        v-if="value.spec.model.kind === 'BluetoothDevice'"
        :edit-row-index="editRowIndex"
        :device="value"
        :visible="dialogVisible"
        @addProperties="addProperties($event)"
        @hideDialog="hideDialog($event)"
      />
      <ModbusModel
        v-else-if="value.spec.model.kind === 'ModbusDevice'"
        :visible="dialogVisible"
        :edit-row-index="editRowIndex"
        :device="value"
        @addProperties="addProperties($event)"
        @hideDialog="hideDialog($event)"
      />

      <OpcUaModel
        v-else-if="value.spec.model.kind === 'OPCUADevice'"
        :visible="dialogVisible"
        :edit-row-index="editRowIndex"
        :device="value"
        @addProperties="addProperties($event)"
        @hideDialog="hideDialog($event)"
      />

      <CustomModel
        v-else
        :visible="dialogVisible"
        :template-properties="templateProperties"
        :edit-row-index="editRowIndex"
        :device="value"
        @addProperties="addProperties($event)"
        @hideDialog="hideDialog($event)"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.form {
  .configuration {
    margin-top: 30px;
  }

  .subtract {
    height: 31px;
  }

  .optional {
    i {
      color: #409EFF;
    }
  }
}
</style>

<style lang="scss">
.form {
  .el-select {
    display: block;
  }
}
</style>
