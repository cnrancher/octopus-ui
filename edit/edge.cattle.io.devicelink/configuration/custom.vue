<script>
import CustomTemplate from '@/edit/edge.cattle.io.devicelink/custom/templates';
import createEditView from '@/mixins/create-edit-view';

import { customDevice } from '@/edit/edge.cattle.io.devicelink/defaultYaml';

export default {
  components: { CustomTemplate },

  mixins:     [createEditView],

  props: {
    mode:  { 
      type: String,
      required: true
    },
    value: {
      type:     Object,
      required: true,
    },
  },

  data() {
    const { devicesType } = this.$store.state;

    const value = this.value.spec.model.kind;
    const resource = devicesType.filter((D) => {
      if (D.spec.names.kind === value) {
        return D;
      }
    });
    
    const _spec = this.value.spec;
    const kind = resource[0].spec.names.kind;
    const spec = resource[0].spec.versions[0].schema.openAPIV3Schema.properties.spec.properties;

    this.$set(this.value, 'spec', _.merge(customDevice, _spec));
    const templateProtocol = _.cloneDeep(spec.protocol);

    return { templateProtocol };
  },
};
</script>

<template>
  <div>
    <CustomTemplate
      :key="value.spec.model.kind"
      :template-protocol="templateProtocol"
      :value="value"
    />
  </div>
</template>
