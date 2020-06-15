<script>
/* eslint-disable */
import _ from 'lodash';
import TemplateForm from './templateForm';
import { opcTypeOption, register } from '@/config/map'

export default {
  props: {
    templateProperties: {
      type: Object,
      default: () => {}
    },
    value: {
      type:    Object,
      default: () => {}
    },
    visible: {
      type:    Boolean,
      default: false
    },
    dialogModel:  {
      type:     String,
      required: true
    },
    editRowIndex: { 
      type: Number,
      required: true
    },
  },

  components: {
    TemplateForm
  },

  data() {
    let properties = this.translationProperties(this.templateProperties.properties);

    const localDevice = _.cloneDeep(this.value);
    let index = 0;

    if (this.dialogModel === 'create') {
      localDevice.spec.template.spec.properties.push(_.cloneDeep(properties));
      index = localDevice.spec.template.spec.properties.length - 1;
    } else {
      index = this.editRowIndex;
      properties = localDevice.spec.template.spec.properties[index]
    }

    console.log('-----properties', properties);
    return {
      localDevice,
      index,
      properties,
      opcTypeOption,
      register,
      activeNames: []
    };
  },
  
  computed: {
    showModel() {
      return this.visible;
    },
  },

  methods: {
    translationProperties(properties) {
      let keys = Object.keys(properties);
      const obj = {}
    
      keys.forEach(key => {
        if (properties[key].properties) {
          obj[key] = this.translationProperties(properties[key].properties);
        } else if(properties[key].items) {
          obj[key] = this.translationProperties(properties[key].items.properties);
        } else {
          obj[key] = ''
        }
      })

      return obj
    },
    add(formName) {
      const index = this.index;
      this.localDevice.spec.template.spec.properties.splice(index, 1, this.properties)
      const properties = this.localDevice.spec.template.spec.properties;
      console.log('-----this.properties 000', this.properties)
      this.$emit('addProperties', _.cloneDeep(properties));
      this.$nextTick(() => {
        this.$emit('hideDialog', false);
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
  >
    <header slot="title"><span class="icon"></span>添加新属性</header>

    <TemplateForm
      :templateProperties="templateProperties"
      :localDevice="localDevice"
      :properties="properties"
    />

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
</style>
