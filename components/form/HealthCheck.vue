<script>
import { _VIEW } from '@/config/query-params';
import Probe from '@/components/form/Probe';

export default {
  components: { Probe },
  props:      {
    value: {
      type:     Object,
      required: true,
    },
    mode: {
      type:     String,
      required: true,
    },
  },

  computed: {
    isView() {
      return this.mode === _VIEW;
    }
  },

  methods: {
    update() {
      if ( this.isView ) {
        return;
      }
      this.$emit('input', this.value);
    }
  }
};
</script>

<template>
  <div @input="update">
    <div class="row">
      <Probe
        v-model="value.readinessProbe"
        class="col span-12"
        :mode="mode"
        :label="t('workload.container.healthcheck.readinessCheck')"
        :description="t('workload.container.healthcheck.readinessTip')"
        @input="update"
      />
    </div>
    <hr v-if="!isView" />
    <div class="row">
      <Probe
        v-model="value.livenessProbe"
        class="col span-12"
        :mode="mode"
        :label="t('workload.container.healthcheck.livenessCheck')"
        :description="t('workload.container.healthcheck.livenessTip')"
        @input="update"
      />
    </div>
    <hr v-if="!isView" />
    <div class="row mb-0">
      <Probe
        v-model="value.startupProbe"
        class="col span-12"
        :mode="mode"
        :label="t('workload.container.healthcheck.startupCheck')"
        :description="t('workload.container.healthcheck.startupTip')"
        @input="update"
      />
    </div>
  </div>
</template>
