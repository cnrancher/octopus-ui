<script>
/* eslint-disable */
import _ from 'lodash';
import LoadDeps from '@/mixins/load-deps';
import AddTable from './AddTable';
import Footer from '@/components/form/Footer';
import BluethoothModel from './BluethoothModel';
import ModbusModel from './ModbusModel';
import OpcUaModel from './OpcUaModel';
import CustomModel from './custom/CustomModel';
import KeyValue from '@/components/form/KeyValue';
import CustomTemplate from './custom/templates';
import { allHash } from '@/utils/promise';
import { NODE, CUSTOM, NAMESPACES } from '@/config/types';
import { get } from '@/utils/object';

import { 
  BLUE_THOOTH_DEVICE,
  MODBUS_DEVICE_RTU,
  MODBUS_DEVICE_TCP,
  OPC_UA_DEVICE,
  customDevice
} from './defaultYaml';
import { parity, dataBits, deviceDefaultInfo } from '@/config/map';
import { BluethoothDeviceHeader, ModbusDeviceHeader, OPCUADeviceHeader, CUSTOMDeviceHeader } from './type-header';
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

    if (!this.value.metadata) {
      this.$set(this.value, 'metadata', {
        name:        '',
      })

      this.$set(this.value, 'spec', _.cloneDeep(BLUE_THOOTH_DEVICE))
    }

    const validateAccessConfig = (rule, value, callback) => {
      if (this.value.spec.template.spec.macAddress && this.value.spec.template.spec.namespace) {
        callback(new Error('name 或 macAddress不能同时为空'));
      } else {
        callback();
      }
    };

    return {
      deviceDefaultInfo,
      devicesType,
      parity,
      dataBits,
      BluethoothDeviceHeader,
      ModbusDeviceHeader,
      OPCUADeviceHeader,
      activeNames: [],
      dialogVisible: false,
      editRowIndex: -1,
      transferMode: 'rtu',
      allNodes: [],
      allNamespace: [],
      templateProtocol: {},
      templateProperties: {},
      rules: {
        'metadata.name': [
          { required: true, message: '请输入名称' }
        ],
        'metadata.namespace': [
          { required: true, message: '请输入命名空间' }
        ],
        'spec.adaptor.node': [
          { required: true, message: '请选择节点', trigger: 'change' }
        ],
        'spec.template.spec.name': [
          { required: true, message: '请输入设备名称' }
        ],
        'spec.template.spec.macAddress': [
          { validator: validateAccessConfig, trigger: 'blur' }
        ],
        'value.spec.template.spec.protocol.rtu.slaveID': [
          { required: true, message: '请输入SlaveID' }
        ]
      }
    };
  },
  methods: {
    enable(buttonCb) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.save(buttonCb);
        } else {
          buttonCb(false)
          return false;
        }
      });
    },
    async loadDeps() {
      const hash = await allHash({
        nodes:      this.$store.dispatch('management/findAll', { type: NODE, opt: { url: NODE } }),
        namespaces:  this.$store.dispatch('management/findAll', { type: NAMESPACES, opt: { url: NAMESPACES } }),
      });
      const nodes = hash.nodes?.map(node => {
        return {
          value: node.id,
          label: node.id
        }
      })

      const namespaces = hash.namespaces?.map( NS => {
        return {
          value: NS.id,
          label: NS.id
        }
      })
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
      this.dialogVisible = true
    },
    deleteRow(index) {
      this.value.spec.template.spec.properties.splice(index, 1);
    },
    async changeKind(value) {
      this.transferMode = 'rtu';
      if(value === 'ModbusDevice') {
        this.$set(this.value, 'spec', _.cloneDeep(MODBUS_DEVICE_RTU));
      } else if (value === 'BluetoothDevice') {
        this.$set(this.value, 'spec', _.cloneDeep(BLUE_THOOTH_DEVICE));
      } else if (value === 'OPCUADevice') {
        this.$set(this.value, 'spec', _.cloneDeep(OPC_UA_DEVICE));
      } else {
        const resource = this.devicesType.filter(D => {
          if (D.spec.names.kind === value) {
            return  D
          }
        })
        const kind = resource[0].spec.names.kind;
        const spec = resource[0].spec.versions[0].schema.openAPIV3Schema.properties.spec.properties;
        const templateSpec = _.cloneDeep(customDevice);
        templateSpec.adaptor.name = `adaptors.edge.cattle.io/${kind.toLowerCase()}`;
        templateSpec.model.kind = kind;
        templateSpec.template.spec = spec;
        this.$set(this, 'templateProtocol', _.cloneDeep(spec.protocol));
        this.$set(this, 'templateProperties', _.cloneDeep(spec.properties.items));
        console.log(templateSpec, 'ajax******', resource, spec, spec.protocol);
      }
    },
    changeTransferMode(mode) {
      mode === 'rtu' ?
        this.$set(this.value, 'spec', _.cloneDeep(MODBUS_DEVICE_RTU)):
        this.$set(this.value, 'spec', _.cloneDeep(MODBUS_DEVICE_TCP));
    },
    validatorMacAddress(ule, value, callback) {
      let regex = "(([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2})|(([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2})";
      let regexp = new RegExp(regex);
      if (!regexp.test(value)) {
        return false;
      }
      return true;
    },
    getDeviceLabel(device) {
      return deviceDefaultInfo[device.spec.names.kind]?.label || device.spec.names.kind;
    }
  },
  computed: {
    isModeReady() {
      const config = this.value.spec.template.spec.protocol;
      if (config) {
        return Object.keys(config).includes(this.transferMode) ? true : false;
      }
      return false
    },
    currentHeader() {
      const kind = this.value.spec.model.kind;
      let  headers = [];
      if (kind === 'ModbusDevice') {
        headers = ModbusDeviceHeader;
      } else if (kind === 'BluetoothDevice') {
        headers = BluethoothDeviceHeader;
      } else if (kind === 'OPCUADevice') {
        headers = OPCUADeviceHeader;
      } else {
        headers = CUSTOMDeviceHeader;
      }
      return headers
    },
  }
};
</script>

<template>
  <div class="form">
    <el-form ref="form" label-position="left" :rules="rules" :model="value" label-width="100px">
      <el-row :gutter='60'>
        <el-col :span='24'>
          <div class="moduleName">基础配置</div>
        </el-col>

        <el-col :span="12">
          <el-form-item label="名称" prop="metadata.name">
            <el-input v-model="value.metadata.name"></el-input>
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
            >
              <el-option
                v-for="item in allNamespace"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="设备类型" required>
            <el-select v-model="value.spec.model.kind" @change="changeKind">
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
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> 
        </el-col>

        <el-col :span='24'>
          <div class="moduleName">设备标签</div>
        </el-col>

        <el-col :span='24' class="top">
          <el-form-item label="">
            <KeyValue
              key="labels"
              v-model="value.spec.template.metadata.labels"
              :value-multiline="false"
              :pad-left="false"
              :as-map="true"
              valueLabel="值"
              keyLabel="键"
              :read-allowed="false"
              add-label="添加设备标签"
              :protip="false"
            />
          </el-form-item>
        </el-col>

        <el-col :span='24'>
          <div class="moduleName">访问配置</div>
        </el-col>

        <template v-if="value.spec.model.kind === 'BluetoothDevice'">
          <el-col :span="12">
            <el-form-item label="设备名称" prop="spec.template.spec.name">
              <el-input v-model="value.spec.template.spec.name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="Mac Address" prop="spec.template.spec.macAddress">
              <el-input v-model="value.spec.template.spec.macAddress"></el-input>
            </el-form-item>
          </el-col>
        </template>
        
        <template 
          v-else-if="value.spec.model.kind === 'ModbusDevice' && value.spec.template.spec.protocol"
        >
          <el-col :span="12" class="topMargin">
            <el-form-item label="传输模式" required>
              <el-radio-group v-model="transferMode" @change="changeTransferMode">
                <el-radio-button label="rtu">RTU</el-radio-button>
                <el-radio-button label="tcp">TCP</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="SlaveID">
              <el-input v-if="isModeReady" v-model="value.spec.template.spec.protocol[transferMode].slaveID"></el-input>
            </el-form-item>
          </el-col>

          <template v-if="transferMode === 'rtu' && isModeReady">
            <el-col :span="12">
              <el-form-item label="串口" required>
                <el-input v-model="value.spec.template.spec.protocol[transferMode].serialPort"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span='24'>
              <el-collapse v-model="activeNames">
                <el-collapse-item  name="3" class="optional">
                  <template slot="title">
                    <template v-if="activeNames.length <= 0">
                      <i class="el-icon-caret-right"></i>可选rtu配置
                    </template>
                    <template v-else>
                      <i class="el-icon-caret-bottom"></i>可选rtu配置
                    </template>
                  </template>
                  <el-col :span='12'>
                    <el-form-item label="baudRate">
                      <el-input v-model="value.spec.template.spec.protocol[transferMode].baudRate"></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="11" :push="1">
                    <el-form-item label="dataBits">
                      <el-select v-model="value.spec.template.spec.protocol[transferMode].dataBits" clearable>
                        <el-option
                          v-for="item in dataBits" :key="item.value" 
                          :label="item.label"      :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span='12'>
                    <el-form-item label="parity">
                      <el-select v-model="value.spec.template.spec.protocol[transferMode].parity" clearable>
                        <el-option 
                          v-for="item in parity" :key="item.value"
                          :label="item.label" :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="11" :push="1">
                    <el-form-item label="stopBits">
                      <el-select v-model="value.spec.template.spec.protocol[transferMode].stopBits" clearable>
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                </el-collapse-item>
              </el-collapse>
            </el-col>
          </template>

          <template v-else>
            <el-col :span='12'>
              <el-form-item label="IP" required>
                <el-input v-if="isModeReady" v-model="value.spec.template.spec.protocol[transferMode].ip"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Port" required>
                <el-input v-if="isModeReady" v-model="value.spec.template.spec.protocol[transferMode].port"></el-input>
              </el-form-item>
            </el-col>
          </template>
          
        </template>

        <template v-else-if="value.spec.model.kind === 'OPCUADevice' && value.spec.template.spec.protocol">
          <el-col :span='12'>
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
            :templateProtocol="templateProtocol"
            :value="value"
            :key="value.spec.model.kind"
          />
        </template>

        <el-col :span='24'>
          <div class="moduleName">属性配置</div>
        </el-col>

        <el-col :span='24'>
          <el-form-item label="设备属性">
            <span>
              <i class="el-icon-warning"></i>
              注意：设备属性会明文展示所输入信息，请不要填入敏感信息，如涉及敏感信息，请先加密，请防止信息泄露。
            </span>

            <AddTable
              :headers="currentHeader"
              :properties="value.spec.template.spec.properties" 
              @editRow='edit($event)'
              @deleteRow='deleteRow($event)'
            />

            <div class="spacer"></div>

            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline" 
              @click="addAttribute"
            >
              新增属性
            </el-button>

          </el-form-item>
        </el-col>
        <el-col :span="24">
          <Footer :mode="mode" :errors="errors" @save="enable" @done="done" />
        </el-col>
      </el-row>
    </el-form>
    
    <template v-if="dialogVisible">
      <BluethoothModel
        v-if="value.spec.model.kind === 'BluetoothDevice'"
        @addProperties = "addProperties($event)" 
        @hideDialog = "hideDialog($event)"
        :editRowIndex = "editRowIndex"
        :device= "value"
        :visible = 'dialogVisible'
      />
      <ModbusModel
        v-else-if="value.spec.model.kind === 'ModbusDevice'"
        @addProperties = "addProperties($event)" 
        @hideDialog = "hideDialog($event)"
        :visible = 'dialogVisible'
        :editRowIndex = "editRowIndex"
        :device= "value"
      />

      <OpcUaModel
        v-else-if="value.spec.model.kind === 'OPCUADevice'"
        @addProperties = "addProperties($event)" 
        @hideDialog = "hideDialog($event)"
        :visible = 'dialogVisible'
        :editRowIndex = "editRowIndex"
        :device= "value"
      />

      <CustomModel
        v-else
        @addProperties = "addProperties($event)" 
        @hideDialog = "hideDialog($event)"
        :visible = 'dialogVisible'
        :templateProperties="templateProperties"
        :editRowIndex = "editRowIndex"
        :device= "value"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.form {
  width: 1000px;

  .moduleName {
    font-size: 18px;
    margin: 20px 0;
  }

  .top {
    margin-top: -50px;
  }

  .topMargin {
    margin-top: -1px;
  }

  .optional {
    i {
      color: #409EFF;
    }
  }
}
</style>

<style lang="scss">
.el-collapse-item__header {
  font-weight: bold;
  font-size: 18px;
  background-color: #f6f7fb;
}
.el-collapse-item__wrap {
  background-color: #f6f7fb;
  padding-left: 20px;
}
.el-collapse-item__arrow {
  font-size: 0px;
}
</style>
