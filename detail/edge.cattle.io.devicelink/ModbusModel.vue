<script>
import _ from 'lodash';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';

const properties = {
  name:        'temperature',
  description: 'enable data',
  value:       'true',
  dataType:    'boolean',
  readOnly:    'true',
  visitor:     {
    register: 'CoilRegister',
    offset:   2,
    quantity: 1,
  }
};

export default {
  props: ['visible', 'editRow'],
  data() {
    return {
      newProperties: properties,
      typeOption:    [{
        value: 'string',
        label: 'string'
      }, {
        value: 'int',
        label: 'int'
      }, {
        value: 'float',
        label: 'float'
      }, {
        value: 'boolean',
        label: 'boolean'
      }],
      register: [{
        value:    'CoilRegister',
        label:    '线圈寄存器',
        readOnly: 'false',
      }, {
        value:    'DiscreteInputRegister',
        label:    '离散输入寄存器',
        readOnly: 'true'
      }, {
        value:    'HoldingRegister',
        label:    '保持寄存器',
        readOnly: 'false'
      }, {
        value:    'InputRegister',
        label:    '输入寄存器',
        readOnly: 'true'
      }],
      rules: {
        name: [
          {
            required: true, message:  '请输入属性名', trigger:  'blur'
          },
        ],
        'newProperties.description': [
          {
            required: true, message:  '请输入描述', trigger:  'blur'
          }
        ],
      }
    };
  },
  computed: {
    showModel() {
      return this.visible;
    },
  },
  watch: {
    editRow: {
      handler(newval, oldVal) {
        if (newval.data) {
          this.newProperties = _.cloneDeep(newval.data);
        } else {
          this.newProperties = properties;
        }
      },
      deep: true
    }
  },
  methods: {
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('addProperties', _.cloneDeep(this.newProperties));
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
      this.$refs[formName].resetFields();
      this.$emit('hideDialog', false);
    },
    changeRegister(value) {
      this.register.forEach((item) => {
        if (item.value === value) {
          this.newProperties.readOnly = item.readOnly;
        }
      });
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
    <el-form ref="form" label-width="130px" :rules="rules" :model="newProperties">
      <el-form-item label="属性名" prop="name">
        <el-input v-model="newProperties.name"></el-input>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input v-model="newProperties.description" type="textarea"></el-input>
      </el-form-item>

      <el-row>
        <el-col :span="8">
          <el-form-item label="类型">
            <el-select v-model="newProperties.dataType" placeholder="请选择">
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
        <el-col :span="16">
          <el-form-item prop="visitor.value">
            <el-input v-model="newProperties.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="寄存器类型">
        <el-radio-group v-model="newProperties.visitor.register" size="small" @change="changeRegister">
          <el-radio-button v-for="(item, key) in register" :key="key" :label="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="访问模式">
        <el-select v-model="newProperties.readOnly" placeholder="请选择" disabled>
          <el-option label="读/写" value="false"></el-option>
          <el-option label="只读" value="true"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="寄存器偏移地址 ">
        <el-input v-model="newProperties.visitor.offset"></el-input>
      </el-form-item>

      <el-form-item label="寄存器的个数 ">
        <el-input v-model="newProperties.visitor.quantity"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide('form')">取 消</el-button>
      <el-button type="primary" @click="add('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>
