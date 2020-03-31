<script>
import _ from 'lodash';
import KeyValue from '@/components/form/KeyValue';
import { accessMode } from '@/config/map';
import SelectKeyValue from '@/components/SelectKeyValue'

const properties = {
  name:        '',
  description: '',
  accessMode:  'NotifyOnly',
  type:        {
    int: {
      accessMode: 'Read',
      maximun:    100,
      unit:       'degree celsius'
    }
  },
  visitor: {
    characteristicUUID: '',
    defaultValue:       'OFF',
    dataConverter:      {
      startIndex: '',
      endIndex:   '',
      shiftRight: '',
      orderOfOperations: [{
        operationType: 'Multiply',
        operationValue: "0.03125"
      }]
    },
    dataWrite: {
      ON:  '1',
      OFF: '0'
    }
  }
};

export default {
  props: {
    device: {
      type: Object,
      default: () => {}
    },
    visible: {
      type: Boolean,
      default: false
    },
    editRowIndex: {
      type: Number
    }
  },
  components: {
    KeyValue,
    SelectKeyValue
  },
  data() {
    return {
      accessMode,
      localDevice: _.cloneDeep(this.device),
      newProperties: properties,
    };
  },
  computed: {
    showModel() {
      return this.visible;
    },
    index() {
      if (this.editRowIndex < 0) {
        this.localDevice.spec.template.spec.properties.push(this.newProperties);
        const length = this.device.spec.template.spec.properties.length;
        return length
      }
      return this.editRowIndex
    }
  },
  watch: {
    device: {
      handler(newVal, oldVal) {
        this.localDevice = _.cloneDeep(newVal);
      },
      deep: true
    }
  },
  methods: {
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const properties = this.localDevice.spec.template.spec.properties;
          this.$emit('addProperties', _.cloneDeep(properties));
          this.$nextTick(() => {
            this.$refs[formName].resetFields();
          });
          this.$emit('hideDialog', false);
        } else {
          return false;
        }
      });
    },
    hide(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
      this.$emit('hideDialog', false);
    }
  }
};
</script>
<template>
  <el-dialog
    title="添加新属性"
    :visible.sync="showModel"
    :close-on-click-modal="false"
    width="60%"
    :before-close="hide"
  >
    <el-form ref="form" label-width="130px" :model="localDevice">
      <el-form-item
        label="属性名"
        :prop="'spec.template.spec.properties.' + index + '.name'"
        :rules="[
          { required: true, message: '请输入属性名', trigger: 'blur' },
        ]"
      >
        <el-input v-model="localDevice.spec.template.spec.properties[index].name"></el-input>
      </el-form-item>

      <el-form-item 
        label="描述"
        :prop="'spec.template.spec.properties.' + index + '.description'"
        :rules="[
          { required: true, message: '请输入描述', trigger: 'blur' },
        ]"
      >
        <el-input v-model="localDevice.spec.template.spec.properties[index].description" type="textarea"></el-input>
      </el-form-item>

      <el-form-item label="accessMode">
        <el-select v-model="localDevice.spec.template.spec.properties[index].accessMode" placeholder="请选择">
          <el-option
            v-for="item in accessMode"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item 
        label="UUID"
        :prop="'spec.template.spec.properties.' + index + '.visitor.characteristicUUID'"
        :rules="[
          { required: true, message: '请输入UUID', trigger: 'blur' },
        ]"
      >
        <el-input v-model="localDevice.spec.template.spec.properties[index].visitor.characteristicUUID"></el-input>
      </el-form-item>

      <template v-if="localDevice.spec.template.spec.properties[index].accessMode === 'ReadOnly' || localDevice.spec.template.spec.properties[index].accessMode === 'ReadWrite'">
        <el-form-item v-for="(item,key) in localDevice.spec.template.spec.properties[index].visitor.dataConverter" :key="key" :label="key">
          <el-input v-model="localDevice.spec.template.spec.properties[index].visitor.dataConverter[key]"></el-input>
        </el-form-item>
      </template>

      <el-form-item label="defaultValue">
        <el-input v-model="localDevice.spec.template.spec.properties[index].visitor.defaultValue"></el-input>
      </el-form-item>

      <template>
        <el-form-item label="设备标签">
          <KeyValue
            key="labels"
            v-model="localDevice.spec.template.metadata.labels"
            :value-multiline="false"
            :pad-left="false"
            :asMap="true"
            :read-allowed="false"
            add-label="添加设备标签"
            :protip="false"
          />
        </el-form-item>
      </template>

      <!-- <template>
        <el-form-item label="orderOfOperations">
          <SelectKeyValue 
            :value="localDevice.spec.template.spec.properties[index].visitor.dataConverter.orderOfOperations"
          />
        </el-form-item>
      </template> -->

      <template v-if="localDevice.spec.template.spec.properties[index].accessMode === 'ReadWrite'">
        <el-form-item label="dataWrite">
          <KeyValue
            key="labels"
            v-model="localDevice.spec.template.spec.properties[index].visitor.dataWrite"
            :value-multiline="false"
            :pad-left="false"
            :asMap="true"
            :read-allowed="false"
            add-label="Add DataWrite"
            :protip="false"
          />
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide('form')">取 消</el-button>
      <el-button type="primary" @click="add('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>
