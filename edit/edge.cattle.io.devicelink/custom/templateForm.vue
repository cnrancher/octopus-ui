<script>
export default {
  name: 'template-form',
  props: {
    templateProperties: {
      type: Object,
      default: () => {}
    },
    localDevice: {
      type:    Object,
      default: () => {}
    },
    properties: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    console.log('-----properties-hahah1----', this.properties, this.templateProperties, this.localDevice)
    return {

    }
  }
}
</script>

<template>
  <div>
    <template v-for="(v, key) in properties">
      <template v-if="typeof properties[key] === 'object'">
        <h1 :key="key">{{key}}</h1>        
        <!-- <template-form
          :key="key"
          :templateProperties="templateProperties"
          :properties="properties[key]"
          :localDevice="localDevice"
        /> -->
      </template>

      <template v-else>
        <template v-if="templateProperties.properties[key].enum">
          
          <el-form-item :label="key" :key="key">
            <el-select v-model="localDevice.spec.template.spec.properties[key]" clearable>
              <el-option
                v-for="label in templateProperties.properties[key].enum" 
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
            :label="key"
            :prop="'spec.template.spec.properties.' + index + key"
            :key="key"
          >
            <el-input v-model="localDevice.spec.template.spec.properties[index][key]"></el-input>
          </el-form-item>
        </template>
      </template>
    </template>
  </div>
</template>
