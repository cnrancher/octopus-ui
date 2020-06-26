<script>
import LabeledInput from '@/components/form/LabeledInput';

export default {
  components: { LabeledInput },

  props: {
    templateSpec: {
      type:     Object,
      required: true,
    }
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          v-model="templateSpec.protocol.url"
          label="URL"
        />
      </div>

      <div class="col span-6">
        <LabeledInput
          v-model="templateSpec.protocol.username"
          label="username"
        />
      </div>
    </div>

    <div class="row">
      <div class="col span-6">
        <LabeledInput
          v-model="templateSpec.protocol.password"
          label="password"
        />
      </div>
    </div>
  </div>
</template>
