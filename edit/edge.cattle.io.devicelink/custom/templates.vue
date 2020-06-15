<script>
/* eslint-disable */
import _ from 'lodash';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import ButtonGroup from '@/components/ButtonGroup';

export default {
  components: {
    LabeledInput,
    LabeledSelect
  },

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
    console.log('处理后的properties', properties)
    return {
      properties,
    }
  },
  method: {
    isRequired(key) {
      const requiredArr = this.templateProtocol.required || [];
      return requiredArr.includes(key);
    },
  }
}
</script>

<template>
  <div class="config">
    <template v-for="(prop, key) in properties">
      <template v-if="templateProtocol.properties[key].required">
        <div class="span-12" :key="key">
          <h2 class="title" :key="key">{{key}}</h2>
        </div>
               
        <template v-for="(deepProp, deepKey) in templateProtocol.properties[key].properties">
          
          <template v-if="templateProtocol.properties[key].properties[deepKey].enum">
            <div class="span-6" :key="key + deepKey">
              <LabeledSelect
                v-model.number="value.spec.template.spec.protocol[key][deepKey]"
                :label="deepKey"
                :options="templateProtocol.properties[key].properties[deepKey].enum"
              />
            </div>
            
          </template>

          <template v-else>
            <div class="span-6" :key="key + deepKey">
              <LabeledInput
                v-model="value.spec.template.spec.protocol[key][deepKey]"
                :label="deepKey"
              />
            </div>
          </template>
        </template>

      </template>

      <template v-else-if="templateProtocol.properties[key].enum">
        <div class="span-6" :key="key">
          <LabeledSelect
            :key="key"
            :label="label"
            v-model="value.spec.template.spec.protocol[key]"
            :options="templateProtocol.properties[key].enum" 
          />
        </div>
      </template>

      <template v-else>
        <div class="span-6" :key="key">
          <LabeledInput
            :key="key"
            :label="key"
            v-model="value.spec.template.spec.protocol[key]"
          />
        </div>
      </template>

    </template>
  </div>
</template>

<style lang="scss" scoped>
.config {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: space-between !important;
}

.span-6, .span-12 {
  margin-bottom: 20px;
}
</style>
