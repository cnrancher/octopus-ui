<script>
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import Checkbox from '@/components/form/Checkbox';
import ButtonGroup from '@/components/ButtonGroup';
import {
  MQTT_DEVICE,
  MQTT_DEVICE_MESSAGE
} from '@/edit/edge.cattle.io.devicelink/defaultYaml';

export default {
  components: {
    Checkbox,
    ButtonGroup,
    LabeledInput,
    LabeledSelect
  },
  props: {
    templateSpec: {
      type:     Object,
      required: true,
    }
  },

  data() {
    return { tempStorage: null };
  },

  computed: {
    transferMode: {
      get() {
        if (this.templateSpec.protocol.pattern === 'AttributedTopic') {
          return 'AttributedTopic';
        } else if (this.templateSpec.protocol.pattern === 'AttributedMessage') {
          return 'AttributedMessage';
        }

        return 'AttributedTopic';
      },
      set(mode) {
        this.changeTransferMode(mode);

        return mode;
      }
    },
    modeOption() {
      return [
        { label: '属性化主题', value: 'AttributedTopic' },
        { label: '属性化消息', value: 'AttributedMessage' }
      ];
    },
    qosList() {
      return [
        { label: '0 - Send at most once', value: 0 },
        { label: '1 - Send at least once', value: 1 },
        { label: '2 - Send exactly once', value: 2 },
      ];
    },
  },

  methods: {
    changeTransferMode(mode) {
      this.templateSpec.protocol.pattern = mode;
    },
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-6">
        <ButtonGroup :value="transferMode" :options="modeOption" @input="changeTransferMode" />
      </div>
    </div>

    <div class="row">
      <div class="col span-6">
        <LabeledInput
          v-model="templateSpec.protocol.client.server"
          label="MQTT Server"
          required
        />
      </div>

      <div class="col span-6">
        <LabeledInput
          v-model="templateSpec.protocol.message.topic"
          label="topic"
          required
        />
      </div>
    </div>

    <div class="row">
      <div class="col span-6">
        <LabeledSelect
          v-model.number="templateSpec.protocol.qos"
          label="QoS"
          :options="qosList"
        />
      </div>

      <div class="col span-6">
        <Checkbox
          v-model="templateSpec.protocol.retainted"
          class="checkbox"
          label="Retainted"
          type="checkbox"
        />
      </div>
    </div>

    <div class="row">
      <div class="col span-6">
        <LabeledInput
          v-model="templateSpec.protocol.operator.read"
          label="读路径(订阅)"
        />
      </div>

      <div class="col span-6">
        <LabeledInput
          v-model="templateSpec.protocol.operator.write"
          label="写路径(推送)"
        />
      </div>
    </div>
  </div>
</template>
