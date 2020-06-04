<script>
export default {
  name:  'TemplateForm',
  props: {
    templateProperties: {
      type:    Object,
      default: () => {}
    },
    localDevice: {
      type:    Object,
      default: () => {}
    },
    properties: {
      type:    Object,
      default: () => {}
    },
    index: {
      type:    Number,
      default: 0
    }
  },
  data() {
    console.log('---current properties', this.properties); // eslint-disable-line no-console
    let PropertiesType = {};

    if (this.templateProperties.properties) {
      PropertiesType = this.templateProperties.properties;
    } else if (this.templateProperties.items) {
      PropertiesType = this.templateProperties.items.properties;
    } else {
      PropertiesType = this.templateProperties;
    }

    return {
      PropertiesType,
      localProperties: this.properties
    };
  }
};
</script>

<template>
  <div>
    <template v-for="(v, key) in localProperties">
      <template v-if="typeof localProperties[key] === 'object'">
        <template-form
          :key="key"
          :template-properties="PropertiesType[key]"
          :properties="localProperties[key]"
        />
      </template>

      <template v-else>
        <template v-if="PropertiesType[key].enum">
          <el-form-item :key="key" :label="key">
            <el-select v-model="localProperties[key]">
              <el-option
                v-for="label in PropertiesType[key].enum"
                :key="label"
                :label="label"
                :value="label"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item
            :key="key"
            :label="key"
          >
            <el-input v-model="localProperties[key]"></el-input>
          </el-form-item>
        </template>
      </template>
    </template>
  </div>
</template>
