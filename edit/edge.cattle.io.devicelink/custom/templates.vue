<script>
/* eslint-disable */
export default {
  props: {
    templateProtocol: {
      type: Object,
      default: () => {}
    },
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const protocol = this.templateProtocol.properties;
    const properties = {};
    const keys = Object.keys(protocol);
    keys.forEach((key) => {
      const deepProperties = Object.keys(protocol[key]);
     
      if (deepProperties.includes('properties')) {
        const types = Object.keys(protocol[key].properties);
        Object.assign(properties, {
          [key]: {}
        })
        types.forEach((Deepkey) => {
          Object.assign(properties[key], {
            [Deepkey]: ''
          })
        })
      } else {
        Object.assign(properties, {
          [key]: ''
        })
      }
    })
    
    this.$set(this.value.spec.template.spec, 'protocol', _.cloneDeep(properties));
    return {
      properties,
    }
  },
  method: {
    isRequired(key) {
      const requiredArr = this.templateProtocol.required || [];
      return requiredArr.includes(key);
    },
    formatProperties() {
      const { properties } = this.templateProtocol;
    },
  }
}
</script>

<template>
  <div id="protocol">
    <template v-for="(prop, key) in properties">
      <template v-if="templateProtocol.properties[key].required">
        <h3 class="title" :key="key">{{key}}</h3>
        <template v-for="(deepProp, deepKey) in templateProtocol.properties[key].properties">
          <template v-if="templateProtocol.properties[key].properties[deepKey].enum">
            <el-col :span="12" :key="key + deepKey">
              <el-form-item :label="deepKey">
                <el-select v-model="value.spec.template.spec.protocol[key][deepKey]" clearable>
                  <el-option
                    v-for="label in templateProtocol.properties[key].properties[deepKey].enum" :key="label"
                    :label="label" :value="label"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>

          <template v-else>
            <el-col 
              :span="12" 
              :key="key + deepKey"
            >
              <el-form-item :label="deepKey">
                <el-input v-model="value.spec.template.spec.protocol[key][deepKey]"></el-input>
              </el-form-item>
            </el-col>
          </template>

        </template>
      </template>

      <template v-else-if="templateProtocol.properties[key].enum">
        <el-col :span="12" :key="key">
          <el-form-item :label="key">
            <el-select v-model="value.spec.template.spec.protocol[key]" clearable>
              <el-option
                v-for="label in templateProtocol.properties[key].enum" :key="label"
                :label="label" :value="label"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </template>

      <template v-else>
        <el-col :span="12" :key="key">
          <el-form-item :label="key">
            <el-input v-model="value.spec.template.spec.protocol[key]"></el-input>
          </el-form-item>
        </el-col>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
#protocol {
  margin-left: 30px;
  .title {
    margin-left: 30px;
  }
}
</style>
