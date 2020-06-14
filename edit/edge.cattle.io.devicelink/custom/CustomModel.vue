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
    TemplateForm
  },
  data() {
    console.log('------this.templateProperties', this.templateProperties.properties);
    console.log('------editRowIndex-----', this.editRowIndex);
    const { required } = this.templateProperties;
    const properties = this.translationProperties(this.templateProperties.properties);
    console.log('-----properties', properties);
    return {
      localDevice:   _.cloneDeep(this.device),
      index: 0,
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
  watch: {
    device: {
      handler(newVal, oldVal) {
        const length = this.device.spec.template.spec.properties.length;
        this.localDevice = _.cloneDeep(newVal);
        if (length <= 0) {
          this.localDevice.spec.template.spec.properties.push(_.cloneDeep(this.properties));
        }
      },
      deep: true,
    },
    editRowIndex: {
      handler() {
        if (this.editRowIndex < 0) {
          this.localDevice.spec.template.spec.properties.push(_.cloneDeep(this.properties));
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
      const properties = this.localDevice.spec.template.spec.properties;
      console.log('-----应该有的值', properties)
      // this.$emit('addProperties', _.cloneDeep(properties));
      // this.$nextTick(() => {
      //   this.$emit('hideDialog', false);
      // });
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

    <TemplateForm
      :templateProperties="templateProperties"
      :localDevice="localDevice"
      :properties="properties"
      :index="index"
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
