<script>
import _ from 'lodash';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import createEditView from '@/mixins/create-edit-view';
import { _EDIT, _CREATE } from '@/config/query-params';
import { customDevice } from '@/edit/edge.cattle.io.devicelink/defaultYaml';

export default {
  components: { LabeledSelect, LabeledInput },

  props: {
    kind: {
      type:     String,
      required: true
    },
    templateSpec: {
      type:     Object,
      required: true
    }
  },

  data() {
    const { devicesType } = this.$store.state || [];

    return {
      devicesType,
      properties:       {},
      templateProtocol: {},
    };
  },

  computed: {
    isRequired(key) {
      const requiredArr = this.templateProtocol?.required || [];

      return requiredArr.includes(key);
    },
  },
  watch: {
    kind: {
      handler() {
        const resource = this.devicesType.filter((D) => {
          if (D.spec.names.kind === this.kind) {
            return D;
          }
        });

        const _templateSpec = _.cloneDeep(customDevice.template.spec);

        const mergeProtocol = _.merge(_templateSpec.protocol, this.templateSpec.protocol);

        this.$set(this.templateSpec, 'protocol', _.cloneDeep(mergeProtocol));

        const spec = resource[0].spec.versions[0].schema.openAPIV3Schema.properties.spec.properties;
        const templateProtocol = _.cloneDeep(spec.protocol);

        const protocol = templateProtocol?.properties || {};
        const keys = Object.keys(protocol);
        let properties = {};

        keys.forEach((key) => {
          const deepProperties = Object.keys(protocol[key]);

          if (deepProperties.includes('properties')) {
            const types = Object.keys(protocol[key].properties);

            Object.assign(properties, { [key]: {} });

            types.forEach((Deepkey) => {
              Object.assign(properties[key], { [Deepkey]: '' });
            });
          } else {
            Object.assign(properties, { [key]: '' });
          }
        });

        const _protocol = _.cloneDeep(this.templateSpec.protocol);

        properties = _.merge(properties, _protocol);

        this.$set(this.templateSpec, 'protocol', _.cloneDeep(properties));
        this.$set(this, 'templateProtocol', _.cloneDeep(templateProtocol));
        this.$set(this, 'properties', _.cloneDeep(properties));
      },
      immediate: true,
    }
  },
};
</script>

<template>
  <div class="config">
    <template v-for="(prop, key) in properties">
      <template v-if="templateProtocol.properties[key].required">
        <div :key="key" class="span-12">
          <h2 :key="key" class="title">
            {{ key }}
          </h2>
        </div>

        <template v-for="(deepProp, deepKey) in templateProtocol.properties[key].properties">
          <template v-if="templateProtocol.properties[key].properties[deepKey].enum">
            <div :key="key + deepKey" class="span-6">
              <LabeledSelect
                v-model.number="templateSpec.protocol[key][deepKey]"
                :label="deepKey"
                :options="templateProtocol.properties[key].properties[deepKey].enum"
              />
            </div>
          </template>

          <template v-else>
            <div :key="key + deepKey" class="span-6">
              <LabeledInput
                v-model="templateSpec.protocol[key][deepKey]"
                :label="deepKey"
              />
            </div>
          </template>
        </template>
      </template>

      <template v-else-if="templateProtocol.properties[key].enum">
        <div :key="key" class="span-6">
          <LabeledSelect
            :key="key"
            v-model="templateSpec.protocol[key]"
            :label="key"
            :options="templateProtocol.properties[key].enum"
          />
        </div>
      </template>

      <template v-else>
        <div :key="key" class="span-6">
          <LabeledInput
            :key="key"
            v-model="templateSpec.protocol[key]"
            :label="key"
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
