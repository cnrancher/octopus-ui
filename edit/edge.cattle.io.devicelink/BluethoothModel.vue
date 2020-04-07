<script>
/* eslint-disable */
import _ from 'lodash';
import KeyValue from '@/components/form/KeyValue';
import SelectKeyValue from '@/components/SelectKeyValue';
import { accessMode } from '@/config/map';

const properties = {
  name: '',
  description: '',
  accessMode: 'NotifyOnly',
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
    SelectKeyValue
  },

  props: {
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
      accessMode,
      localDevice,
      index: 0
    };
  },
  computed: {

  },
  watch: {
    device: {
      handler (newVal, oldVal) {
        const length = this.device.spec.template.spec.properties.length;
        this.localDevice = _.cloneDeep(this.device)
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
  methods: {
    add (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let properties = this.localDevice.spec.template.spec.properties;
          properties = this.clearEmptyString(properties);

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
    hide (formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
      this.$emit('hideDialog', false);
    },
    clearEmptyString(obj) {
      const keys = Object.keys(obj);
      keys.forEach( key => {
        if (typeof  obj[key] !== 'object') {
          if(obj[key] === '') {
            delete obj[key]
          }
        } else {
          this.clearEmptyString(obj[key])
        }
      })
      return obj;
    }
  }
};
</script>
<template>
  <el-dialog
    :visible.sync="this.visible"
    :close-on-click-modal="false"
    width="822px"
    class="popUp"
    :before-close="hide"
    v-if="localDevice.spec.template.spec.properties.length"
  > 
    <header slot="title"><span class="icon"></span>添加新属性</header>
    <el-form
      ref="form"
      label-width="140px"
      :model="localDevice"
      class="form-container"
    >
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
        <el-input
          v-model="localDevice.spec.template.spec.properties[index].description"
          maxlength="256"
          show-word-limit
        ></el-input>
      </el-form-item>

      <el-form-item
        label="accessMode"
        :prop="'spec.template.spec.properties.' + index + '.accessMode'"
        :rules="[
          { required: true, message: '请选择accessMode', trigger: 'change' }
        ]"
      >
        <el-select v-model="localDevice.spec.template.spec.properties[index].accessMode">
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

      <template 
        v-if="localDevice.spec.template.spec.properties[index].accessMode === 'ReadOnly' || localDevice.spec.template.spec.properties[index].accessMode === 'ReadWrite'">
        <el-form-item
          v-for="(item,key) in localDevice.spec.template.spec.properties[index].visitor.dataConverter"
          v-if="typeof localDevice.spec.template.spec.properties[index].visitor.dataConverter[key] !== 'object'"
          :key="key"
          :label="key"
        > 
          <el-input v-model="localDevice.spec.template.spec.properties[index].visitor.dataConverter[key]"></el-input>
        </el-form-item>
      </template>

      <template v-if="localDevice.spec.template.spec.properties[index].accessMode !== 'NotifyOnly'">
        <el-form-item label="Operations">
          <SelectKeyValue :value="localDevice.spec.template.spec.properties[index].visitor.dataConverter.orderOfOperations" />
        </el-form-item>
      </template>

      <template v-if="localDevice.spec.template.spec.properties[index].accessMode === 'ReadWrite'">

        <el-form-item label="defaultValue">
          <el-input v-model="localDevice.spec.template.spec.properties[index].visitor.defaultValue"></el-input>
        </el-form-item>

        <el-form-item label="dataWrite">
          <KeyValue
            key="labels"
            v-model="localDevice.spec.template.spec.properties[index].visitor.dataWrite"
            :value-multiline="false"
            :pad-left="false"
            :as-map="true"
            :read-allowed="false"
            valueLabel="值"
            keyLabel="键"
            add-label="Add DataWrite"
            :protip="false"
          />
        </el-form-item>
      </template>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="hide('form')">取 消</el-button>
      <el-button
        type="primary"
        @click="add('form')"
      >确 定</el-button>
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

.form-container {
  width: 580px;
  margin: auto;
  padding-right: 66px;
}

</style>

<style lang='scss'>
.el-input {
  INPUT:not([type]):not(.view),
  INPUT[type='text']:not(.view),
  INPUT[type='password']:not(.view),
  INPUT[type='number']:not(.view),
  INPUT[type='date']:not(.view),
  INPUT[type='email']:not(.view),
  INPUT[type='search']:not(.view),
  INPUT[type='tel']:not(.view),
  INPUT[type='url']:not(.view),
  SELECT:not(.view),
  TEXTAREA:not(.view),
  .labeled-input:not(.view) {
    background-color: transparent !important;
  }
  TEXTAREA {
    background-color: transparent !important;
  }
}

</style>
