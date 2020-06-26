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
        v-model="templateSpec.protocol.name"
        label="蓝牙设备名称"
        required
      />
    </div>
    <div class="col span-6">
      <LabeledInput
        v-model="templateSpec.protocol.macAddress"
        label="Mac Address"
        required
      />
    </div>
  </div>
</template>
