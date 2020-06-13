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
  }
};
</script>

<template>
  <div class="pl-10">
    <div class="row">
      <Probe
        v-model="value.readinessProbe"
        class="col span-12"
        :mode="mode"
        label="Readiness Check"
        :description="t('workload.container.healthcheck.readinessTip')"
      />
    </div>
    <hr v-if="!isView" />
    <div class="row">
      <Probe
        v-model="value.livenessProbe"
        class="col span-12"
        :mode="mode"
        label="Liveness Check"
        :description="t('workload.container.healthcheck.livenessTip')"
      />
    </div>
    <hr v-if="!isView" />
    <div class="row mb-0">
      <Probe
        v-model="value.startupProbe"
        class="col span-12"
        :mode="mode"
        label="Startup Check"
        :description="t('workload.container.healthcheck.startupTip')"
      />
    </div>
  </div>
</template>
