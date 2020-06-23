<script>
import { get } from '@/utils/object';
import RadioGroup from '@/components/form/RadioGroup';
import UnitInput from '@/components/form/UnitInput';

export default {
  components: { RadioGroup, UnitInput },
  props:      {
    value: {
      type:    Object,
      default: () => {
        return {};
      }
    },
    mode: { type: String, default: 'edit' }
  },
  data() {
    const { strategy:strategyObj = {}, minReadySeconds = 0, progressDeadlineSeconds = 600 } = this.value;
    const strategy = strategyObj.type;
    const maxUnavailable = get(strategyObj, `${ strategy }.maxUnavailable`) || 0;
    const maxSurge = get(strategyObj, `${ strategy }.maxSurge`) || 1;

    let actualStrategy = 'recreate';

    if (strategy === 'RollingUpdate') {
      if (maxUnavailable === 0 && maxSurge !== 0) {
        actualStrategy = 'newOld';
      } else if (maxSurge === 0 && maxUnavailable !== 0) {
        actualStrategy = 'oldNew';
      } else {
        actualStrategy = 'custom';
      }
    }

    const batchSize = Math.max(maxUnavailable, maxSurge) || 1;

    return {
      actualStrategy,
      strategy,
      batchSize,
      minReadySeconds,
      progressDeadlineSeconds,
      maxSurge,
      maxUnavailable
    };
  },
  watch: {
    actualStrategy(neu) {
      switch (neu) {
      case 'oldNew':
        this.maxSurge = 0;
        this.maxUnavailable = this.batchSize;
        this.strategy = 'RollingUpdate';
        break;
      case 'newOld':
        this.maxSurge = this.batchSize;
        this.maxUnavailable = 0;
        this.strategy = 'RollingUpdate';
        break;
      case 'recreate':
        this.maxSurge = null;
        this.maxUnavailable = null;
        this.strategy = 'recreate';
        break;
      default:
        this.strategy = 'RollingUpdate';
        break;
      }
      this.update();
    }
  },

  rendered() {
    this.update();
  },
  methods: {
    update() {
      const out = {
        ...this.value,
        progressDeadlineSeconds: this.progressDeadlineSeconds,
        minReadySeconds:         this.minReadySeconds
      };

      switch (this.actualStrategy) {
      case 'oldNew':
        out.strategy = {
          type:          'RollingUpdate',
          rollingUpdate: {
            maxSurge:       0,
            maxUnavailable: this.batchSize
          }
        };
        break;
      case 'newOld':
        out.strategy = {
          type:          'RollingUpdate',
          rollingUpdate: {
            maxSurge:       this.batchSize,
            maxUnavailable: 0
          }
        };
        break;
      case 'recreate':
        out.strategy = { type: 'Recreate' };
        break;
      default:
        out.strategy = {
          type:          'RollingUpdate',
          rollingUpdate: {
            maxSurge:       this.maxSurge,
            maxUnavailable: this.maxUnavailable
          }
        };
        break;
      }

      this.$emit('input', out);
    }
  }
};
</script>

<template>
  <div class="pl-10" @input="update">
    <div class="row">
      <div class="col span-6">
        <RadioGroup
          v-model="actualStrategy"
          :options="['newOld', 'oldNew', 'recreate', 'custom']"
          :labels="[
            t('workload.formUpgrade.strategy.newOld'),
            t('workload.formUpgrade.strategy.oldNew'),
            t('workload.formUpgrade.strategy.recreate'),
            t('workload.formUpgrade.strategy.custom')
          ]"
          :mode="mode"
        />
      </div>
      <div v-if="actualStrategy !== 'recreate'" class="col span-6">
        <UnitInput v-if="actualStrategy !=='custom'" v-model="batchSize" :suffix="batchSize == 1 ? 'Pod' : 'Pods'" :label="t('workload.formUpgrade.batchSize.label')" :mode="mode">
          <template v-slot:label>
            <span :style="{'color':'var(--input-label)'}">
              {{ t('workload.formUpgrade.batchSize.label') }}
              <i v-tooltip="t('workload.formUpgrade.batchSize.detail')" class="icon icon-info" style="font-size: 14px" />
            </span>
          </template>
        </UnitInput>
        <template v-else>
          <div class="row">
            <div class="col span-6">
              <UnitInput v-model="maxSurge" :suffix="maxSurge == 1 ? 'Pod' : 'Pods'" :label="t('workload.formUpgrade.maxSurge.label')" :mode="mode">
                <template v-slot:label>
                  <span :style="{'color':'var(--input-label)'}">
                    {{ t('workload.formUpgrade.maxSurge.label') }}
                    <i v-tooltip="t('workload.formUpgrade.maxSurge.detail')" class="icon icon-info" style="font-size: 14px" />
                  </span>
                </template>
              </UnitInput>
            </div>
            <div class="col span-6">
              <UnitInput v-model="maxUnavailable" :suffix="maxUnavailable == 1 ? 'Pod' : 'Pods'" :label="t('workload.formUpgrade.maxUnavailable.label')" :mode="mode">
                <template v-slot:label>
                  <span :style="{'color':'var(--input-label)'}">
                    {{ t('workload.formUpgrade.maxUnavailable.label') }}
                    <i v-tooltip="t('workload.formUpgrade.maxUnavailable.detail')" class="icon icon-info" style="font-size: 14px" />
                  </span>
                </template>
              </UnitInput>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="row">
      <div class="col span-6">
        <UnitInput v-model="minReadySeconds" :suffix="minReadySeconds == 1 ? 'Second' : 'Seconds'" :label="t('workload.formUpgrade.minReadySeconds.label')" :mode="mode">
          <template #label>
            <label :style="{'color':'var(--input-label)'}">
              {{ t('workload.formUpgrade.minReadySeconds.label') }}
              <i v-tooltip="t('workload.formUpgrade.minReadySeconds.detail')" class="icon icon-info" style="font-size: 14px" />
            </label>
          </template>
        </UnitInput>
      </div>
      <div class="col span-6">
        <UnitInput v-model="progressDeadlineSeconds" :suffix="progressDeadlineSeconds == 1 ? 'Second' : 'Seconds'" :label="t('workload.formUpgrade.progressDeadlineSeconds.label')" :mode="mode">
          <template #label>
            <label :style="{'color':'var(--input-label)'}">
              {{ t('workload.formUpgrade.progressDeadlineSeconds.label') }}
              <i v-tooltip="t('workload.formUpgrade.progressDeadlineSeconds.detail')" class="icon icon-info" style="font-size: 14px" />
            </label>
          </template>
        </UnitInput>
      </div>
    </div>
  </div>
</template>
