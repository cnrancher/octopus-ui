<script>
import _ from 'lodash';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import { opcTypeOption, register, booleanType, READ_ONLY } from '@/config/map';

const properties = {
  name:        '',
  description: '',
  value:       '',
  dataType:    'boolean',
  readOnly:    false,
  visitor:     {
    nodeID:     '',
    browseName: '',
  }
};

export default {
  components: {
    LabeledInput,
    LabeledSelect
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
    editRowIndex: {
      type:     Number,
      required: true
    },
    dialogModel: {
      type:     String,
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
      index,
      register,
      booleanType,
      READ_ONLY,
      localDevice,
      opcTypeOption,
      activeNames:   [],
      newProperties: properties,
    };
  },

  computed: {
    propLength() {
      return this.localDevice.spec.template.spec.properties.length;
    }
  },

  methods: {
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
      this.register.forEach((item) => {
        if (item.value === value) {
          const index = this.index;

          this.localDevice.spec.template.spec.properties[index].readOnly = item.readOnly;
        }
      });
    },
    clearValue() {
      const index = this.index;

      this.localDevice.spec.template.spec.properties[index].value = '';
    }
  }
};
</script>

<template>
  <el-dialog
    v-if="propLength"
    width="1000px"
    class="popUp"
    :visible.sync="visible"
    :close-on-click-modal="false"
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
          placeholder="请输入名称"
        />
      </div>

      <div class="col span-6">
        <LabeledInput
          v-model="localDevice.spec.template.spec.properties[index].description"
          label="描述"
          placeholder="请输入描述"
        />
      </div>
    </div>

    <div class="row">
      <div class="col span-12">
        <LabeledSelect
          v-model="localDevice.spec.template.spec.properties[index].readOnly"
          label="readOnly"
          :options="READ_ONLY"
        />
      </div>
    </div>

    <div class="row">
      <div class="col span-6">
        <LabeledSelect
          v-model="localDevice.spec.template.spec.properties[index].dataType"
          label="类型"
          :options="opcTypeOption"
          @input="clearValue"
        />
      </div>

      <div v-if="localDevice.spec.template.spec.properties[index].readOnly === false" class="col span-6">
        <select
          v-if="localDevice.spec.template.spec.properties[index].dataType === 'boolean'"
          key="selectDataType"
          v-model="localDevice.spec.template.spec.properties[index].value"
          class="bigInput"
        >
          <option v-for="opt in booleanType" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>

        <input
          v-else
          key="inputDataType"
          v-model="localDevice.spec.template.spec.properties[index].value"
          autocorrect="off"
          class="bigInput"
          autocapitalize="off"
          spellcheck="false"
        />
      </div>
    </div>

    <div class="row">
      <div class="col span-6">
        <LabeledInput
          v-model="localDevice.spec.template.spec.properties[index].visitor.nodeID"
          label="nodeID"
        />
      </div>

      <div class="col span-6">
        <LabeledInput
          v-model="localDevice.spec.template.spec.properties[index].visitor.browseName"
          label="browseName"
        />
      </div>
    </div>

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
  height: 55px;
}
</style>
