<script>
import _ from 'lodash';
import { accessMode } from '@/config/map';

const properties = {
  name:        '',
  description: '',
  accessMode:  'NotifyOnly',
  visitor: {
    characteristicUUID: '',
    dataConverter:      {
      startIndex: '',
      endIndex:   '',
      shiftRight: '',
    },
    dataWrite: {
      ON:  '',
      OFF: ''
    }
  }
};

export default {
  props: ['visible', 'editRow'],
  data() {
    return {
      accessMode,
      newProperties: properties,
      rules: {
        name: [
          {
            required: true, message:  '请输入属性名', trigger:  'blur'
          },
        ],
        description: [
          {
            required: true, message:  '请输入描述', trigger:  'blur'
          }
        ],
        'visitor.characteristicUUID': [
          {
            required: true, message:  '请输入UUID', trigger:  'blur'
          },
        ]
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
      handler(newVal, oldVal) {
        if (newVal.data) {
          this.newProperties = _.cloneDeep(newVal.data);
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
    <el-form ref="form" label-width="130px" :rules="rules" :model="newProperties">
      <el-form-item label="属性名" prop="name">
        <el-input v-model="newProperties.name"></el-input>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input v-model="newProperties.description"></el-input>
      </el-form-item>

      <el-form-item label="accessMode">
        <el-select v-model="newProperties.accessMode" placeholder="请选择">
          <el-option
            v-for="item in accessMode"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="UUID" prop="visitor.characteristicUUID">
        <el-input v-model="newProperties.visitor.characteristicUUID" type="textarea"></el-input>
      </el-form-item>

      <template v-if="newProperties.accessMode === 'ReadOnly'">
        <el-form-item v-for="(item,key) in newProperties.visitor.dataConverter" :key="key" :label="key">
          <el-input v-model="newProperties.visitor.dataConverter[key]" type="textarea"></el-input>
        </el-form-item>
      </template>

      <template v-if="newProperties.accessMode === 'ReadWrite'">
        <template v-for="(item,keys) in newProperties.visitor.dataWrite">
          <el-col :key="keys" :span="5">
            <el-input value="keys"></el-input>
          </el-col>
          <el-col :key="keys" :span="5">
            <el-input v-model="newProperties.visitor.dataWrite[key]" type="textarea"></el-input>
          </el-col>
        </template>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide('form')">取 消</el-button>
      <el-button type="primary" @click="add('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>
