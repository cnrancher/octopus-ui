<script>
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';

export default {
  name:  'TemplateForm',

  components: {
    LabeledInput,
    LabeledSelect
  },

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
    }
  },

  data() {
    let PropertiesType = {};

    if (this.templateProperties.properties) {
      PropertiesType = this.templateProperties.properties;
    } else if (this.templateProperties.items) {
      PropertiesType = this.templateProperties.items.properties;
    } else {
      PropertiesType = this.templateProperties;
    }
    console.log('----loc, tem', this.localDevice, this.templateProperties)
    return { PropertiesType };
  },
};
</script>

<template>
  <div class="model">
    <template v-for="(v, key) in properties">
      <template v-if="typeof properties[key] === 'object'">
        <div :key="key" class="span-12">
          <template-form
            :properties="properties[key]"
            :template-properties="PropertiesType[key]"
          />
        </div>
      </template>

      <template v-else>
        <template v-if="PropertiesType[key].enum">
          <div :key="key" class="span-6">
            <LabeledSelect
              v-model="properties[key]"
              :label="key"
              :options="PropertiesType[key].enum"
            />
          </div>
        </template>

        <template v-else>
          <div :key="key" class="span-6">
            <LabeledInput
              v-model="properties[key]"
              :label="key"
            />
          </div>
        </template>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.model {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: space-between !important;
}

.span-6 {
  margin-bottom: 20px !important;
}
</style>
