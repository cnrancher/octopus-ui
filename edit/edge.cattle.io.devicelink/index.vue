<script>
/* eslint-disable */
import _ from 'lodash';
import LoadDeps from '@/mixins/load-deps';
import AddTable from './AddTable';
import AddModbusTable from './AddModbusTable';
import Footer from '@/components/form/Footer';
import BluethoothModel from './BluethoothModel';
import ModbusModel from './ModbusModel';
import KeyValue from '@/components/form/KeyValue';
import { allHash } from '@/utils/promise';
import { NODE } from '@/config/types';
import { get } from '@/utils/object';
import { DESCRIPTION } from '@/config/labels-annotations';
import { BLUE_THOOTH_DEVICE, MODBUS_DEVICE_RTU, MODBUS_DEVICE_TCP } from './defaultYaml'
import { parity, dataBits } from '@/config/map'

import createEditView from '@/mixins/create-edit-view';

export default {
  components: {
    AddTable,
    Footer,
    BluethoothModel,
    ModbusModel,
    AddModbusTable,
    KeyValue
  },
  mixins:     [createEditView, LoadDeps],
  data() {
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
      parity,
      dataBits,
      activeNames: [],
      dialogVisible: false,
      editRowIndex: -1,
      transferMode: 'rtu',
      allNodes: [],
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
        'value.spec.template.spec.protocolConfig.rtu.slaveID': [
          { required: true, message: '请输入SlaveID' }
        ]
      }
    };
  },
  methods: {
    enable(buttonCb) {
      this.save(buttonCb);
    },
    async loadDeps() {
      const hash = await allHash({
        nodes:      this.$store.dispatch('deviceLink/findAll', { type: NODE, opt: { url: NODE } })
      });
      const nodes = hash.nodes?.map(node => {
        return {
          value: node.id,
          label: node.id
        }
      })
      this.allNodes = nodes;
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
    changeKind(value) {
      this.transferMode = 'rtu';
      if(value === 'ModbusDevice') {
        this.$set(this.value, 'spec', _.cloneDeep(MODBUS_DEVICE_RTU))
      } else if (value === 'BluetoothDevice') {
        this.$set(this.value, 'spec', _.cloneDeep(BLUE_THOOTH_DEVICE))
      }
    },
    changeTransferMode(mode) {
      if(mode === 'rtu') {
        this.$set(this.value, 'spec', _.cloneDeep(MODBUS_DEVICE_RTU))
      } else {
        this.$set(this.value, 'spec', _.cloneDeep(MODBUS_DEVICE_TCP))
      }
    },
    validatorMacAddress(ule, value, callback) {
      let regex = "(([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2})|(([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2})";
      let regexp = new RegExp(regex);
      if (!regexp.test(value)) {
        return false;
      }
      return true;
    }
  },
  computed: {
    isModeReady() {
      const config = this.value.spec.template.spec.protocolConfig;
      if (config) {
        return Object.keys(config).includes(this.transferMode) ? true : false;
      }
      return false
    }
  }
};
</script>

<template>
  <div class="form">
    <el-form ref="form" label-position="left" :rules="rules" :model="value" label-width="100px">
      <el-row>
        <el-col :span='24'>
          <div class="moduleName">基础配置</div>
        </el-col>

        <el-col :span="12">
          <el-form-item label="名称" prop="metadata.name">
            <el-input v-model="value.metadata.name"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :push="1">
          <el-form-item label="命名空间" prop="metadata.namespace">
            <el-input v-model="value.metadata.namespace"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="设备类型">
            <el-radio-group size="small" v-model="value.spec.model.kind" @change="changeKind">
              <el-radio-button label="ModbusDevice">Modbus Device</el-radio-button>
              <el-radio-button label="BluetoothDevice">Bluethooth Device</el-radio-button>
              <el-radio-button label="OPC_UADevice" disabled>OPC_UA Device</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="11" :push="1">
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

          <el-col :span="11" :push="1">
            <el-form-item label="Mac Address" prop="spec.template.spec.macAddress">
              <el-input v-model="value.spec.template.spec.macAddress"></el-input>
            </el-form-item>
          </el-col>
        </template>
        
        <template 
          v-else-if="value.spec.model.kind === 'ModbusDevice' && value.spec.template.spec.protocolConfig"
        >
          <el-col :span="12">
            <el-form-item label="传输模式" required>
              <el-radio-group size="small" v-model="transferMode" @change="changeTransferMode">
                <el-radio-button label="rtu">RTU</el-radio-button>
                <el-radio-button label="tcp">TCP</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="11" :push="1">
            <el-form-item label="SlaveID">
              <el-input v-if="isModeReady" v-model="value.spec.template.spec.protocolConfig[transferMode].slaveID"></el-input>
            </el-form-item>
          </el-col>

          <template v-if="transferMode === 'rtu' && isModeReady">
            <el-col :span='12'>
              <el-form-item label="串口" required>
                <el-input v-model="value.spec.template.spec.protocolConfig[transferMode].serialPort"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span='24'>
              <el-collapse v-model="activeNames">
                <el-collapse-item title="可选rtu配置" name="3" class="optional">
                  <el-col :span='12'>
                    <el-form-item label="baudRate">
                      <el-input v-model="value.spec.template.spec.protocolConfig[transferMode].baudRate"></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="11" :push="1">
                    <el-form-item label="dataBits">
                      <el-select v-model="value.spec.template.spec.protocolConfig[transferMode].dataBits">
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
                      <el-select v-model="value.spec.template.spec.protocolConfig[transferMode].parity">
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
                      <el-select v-model="value.spec.template.spec.protocolConfig[transferMode].stopBits">
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
                <el-input v-if="isModeReady" v-model="value.spec.template.spec.protocolConfig[transferMode].ip"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="11" :push="1">
              <el-form-item label="Port" required>
                <el-input v-if="isModeReady" v-model="value.spec.template.spec.protocolConfig[transferMode].port"></el-input>
              </el-form-item>
            </el-col>
          </template>
          
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
              v-if="value.spec.model.kind === 'BluetoothDevice'"
              :properties="value.spec.template.spec.properties" 
              :visible='dialogVisible'
              @editRow='edit($event)'
              @deleteRow='deleteRow($event)'
            />

            <AddModbusTable
              v-if="value.spec.model.kind === 'ModbusDevice'"
              :properties="value.spec.template.spec.properties" 
              :visible='dialogVisible'
              @editRow="edit($event)"
              @deleteRow="deleteRow($event)"
            />

            <el-button 
              class="addNew"
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
        v-if="value.spec.model.kind === 'ModbusDevice'"
        @addProperties = "addProperties($event)" 
        @hideDialog = "hideDialog($event)"
        :visible = 'dialogVisible'
        :editRowIndex = "editRowIndex"
        :device= "value"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.form {
  width: 1000px;

  .el-collapse-item__header {
    font-weight: bold;
    font-size: 25px;
  }

  .moduleName {
    font-size: 18px;
    margin: 20px 0;
  }

  .addNew {
    margin-top: 15px;
  }
  .top {
    margin-top: -50px;
  }
}
</style>
