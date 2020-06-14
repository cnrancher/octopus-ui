<script>
/* eslint-disable */
import _ from 'lodash';
import KeyValue from '@/components/form/KeyValue';
import LabeledInput from '@/components/form/LabeledInput';
import ButtonGroup from '@/components/ButtonGroup';
import LabeledSelect from '@/components/form/LabeledSelect';
import { typeOption, register } from '@/config/map'

const properties = {
  name:        '',
  description: '',
  value:       '',
  dataType:    'boolean',
  readOnly:    true,
  visitor:     {
    register: 'DiscreteInputRegister',
    offset:   '',
    quantity: '',
    orderOfOperations: []
  }
};

const options = [{
  label: 'Add',
  value: 'Add'
}, {
  label: 'Subtract',
  value: 'Subtract'
}, {
  label: 'Multiply',
  value: 'Multiply'
}, {
  label: 'Divide',
  value: 'Divide'
}];

const opteionBoolean =[{
  label: 'false',
  value: 'false'
}, {
  label: 'true',
  value: 'true'
}]

export default {
  props: {
    device: {
      type:    Object,
      default: () => {}
    },
    visible: {
      type:    Boolean,
      default: false
    },
    editRowIndex: { type: Number }
  },
  components: {
    KeyValue,
    LabeledInput,
    LabeledSelect,
    ButtonGroup
  },
  data() {
    return {
      opteionBoolean,
      options,
      localDevice:   _.cloneDeep(this.device),
      index: 0,
      newProperties: properties,
      typeOption,
      register,
      activeNames: [],
      porpLength: false,
    };
  },
  computed: {
    showModel() {
      return this.visible;
    },
    disableType() {
      const index = this.index;
      const type = this.localDevice.spec.template.spec.properties[index].visitor.register;

      return type === 'CoilRegister' || type === 'DiscreteInputRegister';
    },
  },
  watch: {
    localDevice: {
      handler(newVal, oldVal) {
        this.porpLength = this.localDevice.spec.template.spec.properties.length;
      },
      deep: true,
      immediate: true
    },
    device: {
      handler (newVal, oldVal) {
        const length = this.device.spec.template.spec.properties.length;
        this.$set(this, 'localDevice', _.cloneDeep(this.device));
      },
      deep: true,
      immediate: true
    },
    editRowIndex: {
      handler() {
        if (this.editRowIndex < 0) {
          this.localDevice.spec.template.spec.properties.push(_.cloneDeep(properties));
          const length = this.localDevice.spec.template.spec.properties.length;
          this.index = length - 1;
        } else {
          this.index = this.editRowIndex;
        }
      },
      immediate: true
    }
  },
  mounted() {
    console.log('---this.localDevice', this.localDevice)
  },
  methods: {
    changedRef(row, val, which) {
      delete row.operationRef;
      delete row.operationType;
      delete row.key;
      delete row.binary;
    },
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const properties = this.localDevice.spec.template.spec.properties;

          this.$emit('addProperties', _.cloneDeep(properties));
          this.$nextTick(() => {
            this.$refs[formName].resetFields();
            this.$emit('hideDialog', false);
          });
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
    },
    changeRegister(value) {
      const index = this.index;
      this.$set(this.localDevice.spec.template.spec.properties[index], 'value', '')
      this.register.forEach((item) => {
        if (item.value === value) {
          this.localDevice.spec.template.spec.properties[index].readOnly = item.readOnly;
        }
      });
    },
    changeDataType() {
      const index = this.index;
      this.$set(this.localDevice.spec.template.spec.properties[index], 'value', '')
    }
  }
};
</script>
<template>
  <el-dialog
    :visible.sync="showModel"
    :close-on-click-modal="false"
    width="822px"
    class="popUp"
    :before-close="hide"
    v-if="porpLength"
  >
    <header slot="title"><span class="icon"></span>添加新属性</header>

    <div class="row">
      <div class="col span-6">
        <LabeledInput
          v-model="localDevice.spec.template.spec.properties[index].name"
          label="属性名"
          mode="create"
        />
      </div>

      <div class="col span-6">
        <LabeledInput
          v-model="localDevice.spec.template.spec.properties[index].description"
          label="描述"
          mode="create"
        />
      </div>
    </div>

    <div class="row">
      <div class="col span-6">
        <LabeledSelect v-model="localDevice.spec.template.spec.properties[index].dataType" label="类型" :options="typeOption" />
      </div>

      <div class="col span-6">
        <LabeledSelect  
          v-if="localDevice.spec.template.spec.properties[index].dataType === 'boolean'" 
          v-model="localDevice.spec.template.spec.properties[index].value" label="类型" :options="opteionBoolean"
          :disabled="localDevice.spec.template.spec.properties[index].readOnly"
        />

        <LabeledInput
          v-else
          v-model="localDevice.spec.template.spec.properties[index].value"
          label=""
          mode="create"
          :disabled="localDevice.spec.template.spec.properties[index].readOnly"
        />
      </div>
    </div>

    <div class="row"> 
      <div class="col span-6"> <!-- 寄存器类型 -->
        <ButtonGroup v-model="localDevice.spec.template.spec.properties[index].visitor.register" :options="register" @input="changeRegister" />
      </div>

      <div class="col span-6">
        <LabeledSelect  
          v-model="localDevice.spec.template.spec.properties[index].readOnly" label="访问模式" :options="[{label: '读/写', value: false}, {label: '只读', value: true}]"
          disabled
        />
      </div>
    </div>

    <div class="row">
      <div class="col span-6">
        <LabeledInput
          v-model="localDevice.spec.template.spec.properties[index].visitor.offset"
          label="寄存器偏移地址"
          mode="create"
        />
      </div>

      <div class="col span-6">
        <LabeledInput
          v-model="localDevice.spec.template.spec.properties[index].visitor.quantity"
          label="寄存器的个数"
          mode="create"
        />
      </div>
    </div>
    
    <KeyValue
      key="operationType"
      v-model="localDevice.spec.template.spec.properties[index].visitor.orderOfOperations"
      key-name="operationType"
      value-name="operationValue"
      :pad-left="false"
      :as-map="false"
      :read-allowed="false"
      :protip="false"
    >
      <template #key="{row}">
        <span>
          <select v-model="row.operationType" @input="changedRef(row, $event.target.value, 'operation')" ref="operation">
            <option v-for="opt in options" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </span>
      </template>
    </KeyValue>

    <span slot="footer" class="dialog-footer">
      <el-button @click="hide('form')">取 消</el-button>
      <el-button type="primary" @click="add('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<style lang="scss" scoped>
.flex {
  display: flex;
}
header {
  display: flex;
  align-items: center;
  font-size: 16px;
  line-height: 36px;
  font-weight: bold;
  color: #363636;

  .icon {
    margin-right: 6px;
    width: 3px;
    height: 18px;
    background-image: linear-gradient(#030b56, #1144d4);
  }
}

.form-container {
  width: 580px;
  margin: auto;
  padding-right: 66px;
}
</style>

<style lang='scss'>
.el-radio-button--small .el-radio-button__inner {
  padding: 9px 14px;
}
</style>
