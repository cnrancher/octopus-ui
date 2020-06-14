<script>
import _ from 'lodash';
import LabeledInput from '@/components/form/LabeledInput';

export default {
  components: { LabeledInput },

  props: {
    value: {
      type:     Object,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {}
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          v-model="value.spec.template.spec.protocol.url"
          label="URL"
          mode="create"
        />
      </div>

      <div class="col span-6">
        <LabeledInput
          v-model="value.spec.template.spec.protocol.username"
          label="username"
          mode="create"
        />
      </div>
    </div>

    <div class="row">
      <div class="col span-6">
        <LabeledInput
          v-model="value.spec.template.spec.protocol.password"
          label="password"
          mode="create"
        />
      </div>
    </div>
  </div>
</template>
