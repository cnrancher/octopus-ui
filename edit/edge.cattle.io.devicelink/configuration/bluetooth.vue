<script>
import LabeledInput from '@/components/form/LabeledInput';

export default {
  components: { LabeledInput },

  props:      {
    templateSpec: {
      type:     Object,
      required: true,
    }
  }
};
</script>

<template>
  <div class="row">
    <div class="col span-6">
      <LabeledInput
        v-model="templateSpec.protocol.endpoint"
        label="蓝牙设备"
        required
      />
    </div>
  </div>
</template>
