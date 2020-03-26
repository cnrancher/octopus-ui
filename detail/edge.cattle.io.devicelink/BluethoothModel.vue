<script>
import _ from 'lodash';

const accessMode = [{
  value: "NotifyOnly",
  label: "NotifyOnly"
}, {
  value: "ReadOnly",
  label: "ReadOnly"
}, {
  value: "ReadWrite",
  label: "ReadWrite"
}];

const properties = {
  name: '',
  description: '',
  accessMode: 'NotifyOnly',
  type: {
    int: {
      accessMode: 'Read',
      maximun: 100,
      unit: 'degree celsius'
    }
  },
  visitor: {
    characteristicUUID: '',
    dataConverter: {
      startIndex: '',
      endIndex: '',
      shiftRight: '',
    },
    dataWrite: {
      ON: '',
      OFF: ''
    }
  }
}

export default {
  props: ['visible', 'editRow'],
  data() {
    return {
      accessMode,
      newProperties: properties,
      rules: {
        name: [
          { required: true, message: '请输入属性名', trigger: 'blur' },
        ],
        'newProperties.description': [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        'visitor.characteristicUUID': [
          { required: true, message: '请输入UUID', trigger: 'blur' },
        ]
      }
    }
  },
  computed: {
    showModel() {
      return this.visible
    },
  },
  methods: {
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('addProperties', _.cloneDeep(this.newProperties));
          this.$nextTick(() => {
            this.$refs[formName].resetFields();
          })
          this.$emit('hideDialog', false);
        } else {
          return false;
        }
      });
    },
    hide(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
      this.$emit('hideDialog', false);
    }
  },
  watch: {
    editRow:{
      handler: function (newval, oldVal) {
        if(newval.data) {
          this.newProperties = _.cloneDeep(newval.data);
        } else {
          this.newProperties = properties
        }
      },
      deep: true
    }
  } 
}
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
        <el-input type="textarea" v-model="newProperties.description" ></el-input>
      </el-form-item>

      <el-form-item label="accessMode">
        <el-select v-model="newProperties.accessMode" placeholder="请选择">
          <el-option
            v-for="item in accessMode"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="UUID" prop='visitor.characteristicUUID'>
        <el-input type="textarea" v-model="newProperties.visitor.characteristicUUID"></el-input>
      </el-form-item>

      <template v-if="newProperties.accessMode === 'ReadOnly'">
        <el-form-item v-for="(item,key) in newProperties.visitor.dataConverter" :label="key" :key="key">
          <el-input type="textarea" v-model="newProperties.visitor.dataConverter[key]"></el-input>
        </el-form-item>
      </template>

      <template v-if="newProperties.accessMode === 'ReadWrite'">
        <el-form-item v-for="(item,key) in newProperties.visitor.dataWrite" :label="key" :key="key">
          <el-input type="textarea" v-model="newProperties.visitor.dataWrite[key]"></el-input>
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide('form')">取 消</el-button>
      <el-button type="primary" @click="add('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>
