<script>
/* eslint-disable */
import _ from 'lodash';
import { typeOption, register } from '@/config/map'

const properties = {
  name:        '',
  description: '',
  value:       'true',
  dataType:    'boolean',
  readOnly:    true,
  visitor:     {
    register: 'CoilRegister',
    offset:   '',
    quantity: '',
  }
};

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
  data() {
    return {
      localDevice:   _.cloneDeep(this.device),
      index: 0,
      newProperties: properties,
      typeOption,
      register,
      activeNames: []
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
    device: {
      handler(newVal, oldVal) {
        const length = this.device.spec.template.spec.properties.length;
        this.localDevice = _.cloneDeep(newVal)
        if (length <= 0) {
          this.localDevice.spec.template.spec.properties.push(_.cloneDeep(properties));
        }
      },
      deep: true,
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
  methods: {
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
      this.register.forEach((item) => {
        if (item.value === value) {
          const index = this.index
          this.localDevice.spec.template.spec.properties[index].readOnly = item.readOnly;
        }
      });
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
    v-if="localDevice.spec.template.spec.properties.length"
  >
    <header slot="title"><span class="icon"></span>添加新属性</header>
    <el-form ref="form" class="form-container" label-width="130px" label-position="right" :model="localDevice">
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
        :prop="'spec.template.spec.properties.' + index + '.name'"
        :rules="[
          { required: true, message: '请输入描述', trigger: 'blur' },
        ]"
      >
        <el-input 
          v-model="localDevice.spec.template.spec.properties[index].description" 
          maxlength="256"
          show-word-limit
        >
        </el-input>
      </el-form-item>

      <el-row type='flex' justify="space-between">
        <el-col :span="15">
          <el-form-item label="类型">
            <el-select v-model="localDevice.spec.template.spec.properties[index].dataType" :disabled="disableType" placeholder="请选择">
              <el-option
                v-for="item in typeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="9">
          <h1>{{localDevice.spec.template.spec.properties.dataType}}</h1>
          <template v-if="localDevice.spec.template.spec.properties[index].dataType === 'boolean'">
            <el-select v-model="localDevice.spec.template.spec.properties[index].value" placeholder="请选择">
              <el-option label="false" value="false"></el-option>
              <el-option label="true"  value="true"></el-option>
            </el-select>
          </template>
          <template v-else>
            <el-input v-model="localDevice.spec.template.spec.properties[index].value"></el-input>
          </template>
        </el-col>
      </el-row>

      <el-form-item label="寄存器类型">
        <el-radio-group class="flex" v-model="localDevice.spec.template.spec.properties[index].visitor.register" size="small" @change="changeRegister">
          <el-radio-button v-for="(item, key) in register" :key="key" :label="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="访问模式">
        <el-select v-model="localDevice.spec.template.spec.properties[index].readOnly" placeholder="请选择">
          <el-option label="读/写" :value="false"></el-option>
          <el-option label="只读" :value="true"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="寄存器偏移地址 ">
        <el-input v-model.number="localDevice.spec.template.spec.properties[index].visitor.offset"></el-input>
      </el-form-item>

      <el-form-item label="寄存器的个数 ">
        <el-input v-model.number="localDevice.spec.template.spec.properties[index].visitor.quantity"></el-input>
      </el-form-item>
   
    </el-form>
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
