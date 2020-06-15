<script>
import CustomTemplate from '@/edit/edge.cattle.io.devicelink/custom/templates';

export default {
  components: { CustomTemplate },

  props: {
    value: {
      type:     Object,
      required: true,
    },
    templateProtocol: {
      type:    Object,
      default: () => {}
    },
  },

  data() {
    return {};
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
