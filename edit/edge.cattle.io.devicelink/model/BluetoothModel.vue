<script>
/* eslint-disable */
import _ from 'lodash';
import KeyValue from '@/components/form/KeyValue';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import { accessMode, operatorList } from '@/config/map';

const properties = {
  name: '',
  description: '',
  accessMode: 'ReadOnly',
  visitor: {
    characteristicUUID: '',
    defaultValue: '',
    dataConverter: {
      startIndex: '',
      endIndex: '',
      shiftRight: '',
      orderOfOperations: []
    },
    dataWrite: {}
  }
};

export default {
  components: {
    KeyValue,
    LabeledInput,
    LabeledSelect
  },

  props: {
    value: {
      type:     Object,
      required: true,
    },
    device: {
      type: Object,
      default: () => { }
    },
    visible: {
      type: Boolean,
      default: false
    },
    editRowIndex: {
      type: Number
    }
  },

  data () {
    const localDevice = _.cloneDeep(this.device);

    return {
      operatorList,
      accessMode,
      localDevice,
      index: 0,
      porpLength: false,
    };
  },
  computed: {
    
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
      handler (newVal, oldVal) {
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
    console.log('----*----', this.localDevice.spec, this.localDevice.spec.template.spec.properties[this.index], this.index)
  },

  methods: {
    add (formName) {
      let properties = this.localDevice.spec.template.spec.properties;
      
      this.$emit('addProperties', _.cloneDeep(properties));
      this.$emit('hideDialog', false);
    },
    hide () {
      this.$emit('hideDialog', false);
    },
    changedRef(row, val, which) {
      delete row.operationRef;
      delete row.operationType;
      delete row.key;
      delete row.binary;
    },
  }
};
</script>
<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="1000px"
    :before-close="hide"
    v-if="localDevice"
  >
    <header slot="title"><span class="icon"></span>添加新属性</header>
    
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          key="attname"
          v-model="localDevice.spec.template.spec.properties[index].name"
          label="属性名"
          mode="create"
        />
      </div>

      <div class="col span-6">
        <LabeledInput
          key="desc"
          v-model="localDevice.spec.template.spec.properties[index].description"
          label="描述"
          mode="create"
        />
      </div>
    </div>

    <div class="row">
      <div class="col span-6">
        <LabeledSelect
          key="accessMode"
          v-model="localDevice.spec.template.spec.properties[index].accessMode" 
          label="accessMode" 
          :options="accessMode" 
        />
      </div>

      <div class="col span-6">
        <LabeledInput
          key="UUID"
          v-model="localDevice.spec.template.spec.properties[index].visitor.characteristicUUID"
          label="UUID"
          mode="create"
        />
      </div>
    </div>

    <template 
      v-if="localDevice.spec.template.spec.properties[index].accessMode === 'ReadOnly' || 
      localDevice.spec.template.spec.properties[index].accessMode === 'ReadWrite'"
    >
      <div class="row">
        <div class="col span-6">
          <LabeledInput
            label="startIndex"
            v-model="localDevice.spec.template.spec.properties[index].visitor.dataConverter.startIndex"
          />
        </div>

        <div class="col span-6">
          <LabeledInput
            label="endIndex"
            v-model="localDevice.spec.template.spec.properties[index].visitor.dataConverter.endIndex"
          />
        </div>
      </div>

      <div class="row">
        <div class="col span-6">
          <LabeledInput
            label="shiftRight"
            v-model="localDevice.spec.template.spec.properties[index].visitor.dataConverter.shiftRight"
          />
        </div>
      </div>
    </template>

    <template v-if="localDevice.spec.template.spec.properties[index].accessMode !== 'NotifyOnly'">
      <div class="row">
        <KeyValue
          key="operationType"
          v-model="localDevice.spec.template.spec.properties[index].visitor.dataConverter.orderOfOperations"
          key-name="operationType"
          value-name="operationValue"
          :pad-left="false"
          :as-map="false"
          :read-allowed="false"
          :protip="false"
        >
          <template #key="{row}">
            <span>
              <select 
                v-model="row.operationType" 
                @input="changedRef(row, $event.target.value, 'operation')" ref="operation"
              >
                <option v-for="opt in operatorList" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </span>
          </template>
        </KeyValue>
      </div>
    </template>

    <template v-if="localDevice.spec.template.spec.properties[index].accessMode === 'ReadWrite'">

      <div class="row">
        <div class="col span-6">
          <LabeledInput 
            v-model="localDevice.spec.template.spec.properties[index].visitor.defaultValue" 
            label="defaultValue" 
          />
        </div>
      </div>

      <div class="row">
        <KeyValue
          key="labels"
          v-model="localDevice.spec.template.spec.properties[index].visitor.dataWrite"
          :value-multiline="false"
          :pad-left="false"
          :as-map="true"
          :read-allowed="false"
          add-label="Add DataWrite"
          :protip="false"
        />
      </div>
     
    </template>
    
    <span class="dialog-footer" slot="footer">
      <el-button @click="hide">取 消</el-button>
      <el-button type="primary" @click="add">确 定</el-button>
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
</style>
