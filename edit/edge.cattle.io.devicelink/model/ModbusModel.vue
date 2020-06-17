<script>
import _ from 'lodash';
import KeyValue from '@/components/form/KeyValue';
import LabeledInput from '@/components/form/LabeledInput';
import ButtonGroup from '@/components/ButtonGroup';
import LabeledSelect from '@/components/form/LabeledSelect';
import { typeOption, register, operatorList, booleanType } from '@/config/map';

const properties = {
  name:        '',
  description: '',
  value:       '',
  dataType:    'boolean',
  readOnly:    true,
  visitor:     {
    register:          'DiscreteInputRegister',
    offset:            '',
    quantity:          '',
    orderOfOperations: []
  }
};

export default {

  components: {
    KeyValue,
    LabeledInput,
    LabeledSelect,
    ButtonGroup
  },
  props: {
    value: {
      type:    Object,
      default: () => {}
    },
    visible: {
      type:    Boolean,
      default: false
    },
    dialogModel: {
      type:     String,
      required: true
    },
    editRowIndex: {
      type:     Number,
      required: true
    },
  },

  data() {
    const localDevice = _.cloneDeep(this.value);
    let index = 0;

    if (this.dialogModel === 'create') {
      localDevice.spec.template.spec.properties.push(_.cloneDeep(properties));
      index = localDevice.spec.template.spec.properties.length - 1;
    } else {
      index = this.editRowIndex;
    }

    return {
      booleanType,
      operatorList,
      localDevice,
      index,
      newProperties: properties,
      typeOption,
      register,
      activeNames:   [],
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

  methods: {
    changedRef(row, val, which) {
      delete row.operationRef;
      delete row.operationType;
      delete row.key;
      delete row.binary;
    },
    add(formName) {
      const properties = this.localDevice.spec.template.spec.properties;

      this.$emit('addProperties', _.cloneDeep(properties));
      this.$nextTick(() => {
        this.$emit('hideDialog', false);
      });
    },
    hide(formName) {
      this.$emit('hideDialog', false);
    },
    changeRegister(value) {
      const index = this.index;

      this.$set(this.localDevice.spec.template.spec.properties[index], 'value', '');
      this.register.forEach((item) => {
        if (item.value === value) {
          this.localDevice.spec.template.spec.properties[index].readOnly = item.readOnly;
        }
      });
    },
    changeDataType() {
      const index = this.index;

      this.$set(this.localDevice.spec.template.spec.properties[index], 'value', '');
    }
  }
};
</script>

<template>
  <el-dialog
    v-if="visible"
    :visible.sync="showModel"
    :close-on-click-modal="false"
    width="822px"
    class="popUp"
    :before-close="hide"
  >
    <header slot="title">
      <span class="icon"></span>添加新属性
    </header>

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
          v-model="localDevice.spec.template.spec.properties[index].value"
          label="类型"
          :options="booleanType"
          :disabled="localDevice.spec.template.spec.properties[index].readOnly"
        />

        <LabeledInput
          v-else
          v-model="localDevice.spec.template.spec.properties[index].value"
          label="值"
          mode="create"
          :disabled="localDevice.spec.template.spec.properties[index].readOnly"
        />
      </div>
    </div>

    <div class="row">
      <div class="col span-6 center">
        <!-- 寄存器类型 -->
        <div>
          <ButtonGroup v-model="localDevice.spec.template.spec.properties[index].visitor.register" :options="register" @input="changeRegister" />
        </div>
      </div>

      <div class="col span-6">
        <LabeledSelect
          v-model="localDevice.spec.template.spec.properties[index].readOnly"
          label="访问模式"
          :options="[{label: '读/写', value: false}, {label: '只读', value: true}]"
          disabled
        />
      </div>
    </div>

    <div class="row">
      <div class="col span-6">
        <LabeledInput
          v-model.number="localDevice.spec.template.spec.properties[index].visitor.offset"
          label="寄存器偏移地址"
          mode="create"
        />
      </div>

      <div class="col span-6">
        <LabeledInput
          v-model.number="localDevice.spec.template.spec.properties[index].visitor.quantity"
          label="寄存器的个数"
          mode="create"
        />
      </div>
    </div>

    <el-divider>Property Operation</el-divider>

    <KeyValue
      key="operationType"
      v-model="localDevice.spec.template.spec.properties[index].visitor.orderOfOperations"
      key-name="operationType"
      value-name="operationValue"
      key-label="Operation"
      :pad-left="false"
      :as-map="false"
      :read-allowed="false"
      :protip="false"
    >
      <template #key="{row}">
        <span>
          <select class="bigInput" ref="operation" v-model="row.operationType" @input="changedRef(row, $event.target.value, 'operation')">
            <option v-for="opt in operatorList" :key="opt.value" :value="opt.value">
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
.bigInput {
  height: 50px;
}
.center {
  display: flex;
  align-items: center;
}
</style>
