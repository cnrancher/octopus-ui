<script>
/* eslint-disable */
import Vue from 'vue';
import { mapGetters } from 'vuex';
import RadioGroup from '@/components/form/RadioGroup';
import LabeledSelect from '@/components/form/LabeledSelect';
import NodeAffinity from '@/components/form/NodeAffinity';
import PodAffinity from '@/components/form/PodAffinity';
import KeyValue from '@/components/form/KeyValue';
import { isEmpty, cleanUp } from '@/utils/object';
import { NODE, POD } from '@/config/types';
import Tolerations from '@/components/form/Tolerations';
import LabeledInput from '@/components/form/LabeledInput';
import UnitInput from '@/components/form/UnitInput';
import { _VIEW } from '@/config/query-params';

export default {
  components: {
    RadioGroup,
    LabeledSelect,
    NodeAffinity,
    PodAffinity,
    KeyValue,
    Tolerations,
    LabeledInput,
    UnitInput
  },
  props:      {
    value: {
      type:     Object,
      required: true
    },
    nodes: {
      type:    Array,
      default: () => []
    },
    mode: { type: String, default: 'edit' },

    showPod: {
      type:    Boolean,
      default: true
    }
  },

  data() {
    const {
      affinity = {}, nodeName = '', nodeSelector = {}, tolerations
    } = this.value;
    const { nodeAffinity = {}, podAffinity = {}, podAntiAffinity = {} } = affinity;

    let selectNode = false;

    if (!this.value.affinity) {
      selectNode = true;
    }

    if (!nodeAffinity.requiredDuringSchedulingIgnoredDuringExecution) {
      this.$set(nodeAffinity, 'requiredDuringSchedulingIgnoredDuringExecution', { nodeSelectorTerms: [] } );
    }
    if (!nodeAffinity.preferredDuringSchedulingIgnoredDuringExecution) {
      this.$set(nodeAffinity, 'preferredDuringSchedulingIgnoredDuringExecution', []);
    }

    return {
      selectNode, 
      nodeName, 
      nodeAffinity, 
      podAffinity, 
      podAntiAffinity, 
      nodeSelector, 
      tolerations,
      userNodeName: true,
      cleanData: true
    };
  },

  computed: {
    node() {
      return NODE;
    },

    pod() {
      return POD;
    },

    isView() {
      return this.mode === _VIEW;
    },

    ...mapGetters({ t: 'i18n/t' })
  },

  watch: {
    nodeName() {
      this.update()
    }
  },

  methods: {
    update() {
      const out = {
        ...this.value,
        tolerations: this.tolerations,
        affinity:    {
          nodeAffinity:    this.nodeAffinity,
          podAffinity:     this.podAffinity,
          podAntiAffinity: this.podAntiAffinity
        }
      };

      if (this.selectNode) {
        this.$set(out, 'nodeName', this.nodeName);
        this.$set(out, 'nodeSelector', this.nodeSelector);
      } else {
        delete out.nodeName;
        delete out.nodeSelector;
      }

      if (this.userNodeName) {
        const keys = Object.keys(this.nodeSelector);
        keys.forEach( K => {
          Vue.delete(this.nodeSelector, K)
        })
        delete out.nodeSelector;
      } else {
        this.nodeName = ''
        delete out.nodeName;
      }

      this.$emit('input', cleanUp(out));
    },
    updateNodeSelector(neu) {
      Vue.delete(this.value, 'nodeName');
      this.nodeSelector = neu;
      this.userNodeName = false;
      this.update();
    },
    updateNodeName(neu) {
      this.cleanData = !this.cleanData
      this.userNodeName = true;
    },
    isEmpty
  },
};

</script>

<template scoped>
  <div @input="update">
    <div>
      <h4>{{ t('workload.scheduling.titles.nodeScheduling') }}</h4>
      <h4 v-if="isView" class="mt-10 mb-10">
        {{ selectNode ? t('workload.scheduling.affinity.specificNode') : t('workload.scheduling.affinity.schedulingRules') }}
      </h4>
      <div v-else class="row">
        <RadioGroup
          v-model="selectNode"
          :options="[true,false]"
          :labels="[t('workload.scheduling.affinity.specificNode'), t('workload.scheduling.affinity.schedulingRules')]"
          :mode="mode"
        />
      </div>
      <template v-if="selectNode">
        <div class="row">
          <div class="col span-6">
            <LabeledSelect
              v-model="nodeName"
              :label="t('workload.scheduling.affinity.nodeName')"
              :options="nodes"
              :mode="mode"
              option-label="id"
              :reduce="opt=>opt.id"
              @input="updateNodeName"
            />
          </div>
        </div>

        <el-divider></el-divider>

        <h4 class="mt-10 mb-10">{{t('workload.scheduling.affinity.nodeLabel')}}</h4>
        <div v-if="mode!=='view' || !isEmpty(nodeSelector)" class="row">
          <KeyValue :key='cleanData' :readAllowed="false" :value="nodeSelector" :mode="mode" :initial-empty-row="true" :pro-tip="false" @input="updateNodeSelector" />
        </div>
      </template>
      <template v-else>
        <NodeAffinity v-model="nodeAffinity" :type="node" :mode="mode" @input="update" />
      </template>
    </div>

    <template v-if="showPod">
      <div>
        <h3 class="mb-10">
          Pod Scheduling
        </h3>
        <h4 class="mb-10">
          <t k="workload.scheduling.affinity.affinityTitle" />
        </h4>
        <div class="row">
          <PodAffinity v-model="podAffinity" :type="pod" :mode="mode" />
        </div>

        <h4 class="mb-10">
          <t k="workload.scheduling.affinity.antiAffinityTitle" />
        </h4>
        <div class="row">
          <PodAffinity v-model="podAntiAffinity" :type="pod" :mode="mode" />
        </div>
      </div>

      <div>
        <h3 class="mb-10">
          Tolerations
        </h3>
        <div class="row">
          <Tolerations :value="value.tolerations" :mode="mode" />
        </div>
      </div>

      <div>
        <h3 class="mb-10">
          Priority
        </h3>
        <div class="row">
          <div class="col span-6">
            <LabeledInput v-model.number="value.priority" :mode="mode" :label="t('workload.scheduling.priority.priority')" />
          </div>
          <div class="col span-6">
            <LabeledInput v-model="value.priorityClassname" :mode="mode" :label="t('workload.scheduling.priority.className')" />
          </div>
        </div>
      </div>

      <div>
        <h3 class="mb-10">
          Advanced
        </h3>
        <div class="row">
          <div class="col span-6">
            <UnitInput v-model.number="value.activeDeadlineSeconds" :mode="mode" suffix="Seconds">
              <template #label>
                <label v-tooltip="t('workload.scheduling.activeDeadlineSecondsTip')" class="label-tip">
                  <t k="workload.scheduling.activeDeadlineSeconds" />
                  <i class="icon icon-info" style="font-size: 12px" />
                </label>
              </template>
            </UnitInput>
          </div>
          <div class="col span-6">
            <UnitInput v-model="value.terminationGracePeriodSeconds" :mode="mode" suffix="Seconds" :label="t('workload.scheduling.terminationGracePeriodSeconds')">
              <template #label>
                <label v-tooltip="t('workload.scheduling.terminationGracePeriodSecondsTip')" class="label-tip">
                  <t k="workload.scheduling.terminationGracePeriodSeconds" />
                  <i class="icon icon-info" style="font-size: 12px" />
                </label>
              </template>
            </UnitInput>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang='scss' >
  .label-tip {
    z-index: z-index('overContent')+1 !important;
  }
  H4 {
    font-size: 14px;
  }
</style>
