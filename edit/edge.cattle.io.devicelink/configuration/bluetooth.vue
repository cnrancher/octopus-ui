<script>
import LabeledInput from '@/components/form/LabeledInput';

export default {
  components: { LabeledInput },
  props:      {
    value: {
      type:    Object,
      default: () => {
        return {};
      }
    }
  }
};
</script>

<template>
  <div class="row">
    <div class="col span-6">
      <LabeledInput v-model="value.spec.template.spec.name" label="蓝牙设备名称" placeholder="" required />
    </div>
    <div class="col span-6">
      <LabeledInput v-model="value.spec.template.spec.macAddress" label="Mac Address" placeholder="" required />
    </div>
  </div>
</template>
