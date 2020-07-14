<script>
import Vue from 'vue';
import _ from 'lodash';
import Checkbox from '@/components/form/Checkbox';
import ButtonGroup from '@/components/ButtonGroup';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import { parity, dataBits } from '@/config/map';
import {
  MODBUS_DEVICE_RTU,
  MODBUS_DEVICE_TCP
} from '@/edit/edge.cattle.io.devicelink/defaultYaml';

export default {
  components: {
    ButtonGroup,
    LabeledInput,
    LabeledSelect,
    Checkbox
  },

  props: {
    templateSpec: {
      type:     Object,
      required: true,
    }
  },

  data() {
    return {
      parity,
      dataBits,
      isChoose:    true,
      tempStorage: null,
    };
  },

  computed: {
    stopBits() {
      return [
        { label: 1, value: 1 },
        { label: 2, value: 2 }
      ];
    },
    modeOption() {
      return [
        { label: 'RTU', value: 'rtu' },
        { label: 'TCP', value: 'tcp' }
      ];
    },
    transferMode: {
      get() {
        if (this.templateSpec.protocol?.tcp) {
          return 'tcp';
        } else if (this.templateSpec.protocol?.rtu) {
          return 'rtu';
        }

        return 'rtu';
      },
      set(mode) {
        this.changeTransferMode(mode);

        return mode;
      }
    },
  },

  methods: {
    changeTransferMode(mode) {
      const tempStorage = _.cloneDeep(this.templateSpec.protocol);

      if (this.tempStorage) {
        this.$set(this.templateSpec, 'protocol', _.cloneDeep(this.tempStorage));
      } else {
        mode === 'rtu'
          ? this.$set(this.templateSpec, 'protocol', _.cloneDeep(MODBUS_DEVICE_RTU.template.spec.protocol))
          : this.$set(this.templateSpec, 'protocol', _.cloneDeep(MODBUS_DEVICE_TCP.template.spec.protocol));
      }

      this.tempStorage = tempStorage;
    },
    deleteData() {
      if (!this.isChoose && this.templateSpec.protocol.rtu) {
        Vue.delete(this.templateSpec.protocol.rtu, 'baudRate');
        Vue.delete(this.templateSpec.protocol.rtu, 'dataBits');
        Vue.delete(this.templateSpec.protocol.rtu, 'parity');
        Vue.delete(this.templateSpec.protocol.rtu, 'stopBits');
      }

      if (this.isChoose && !this.templateSpec.protocol.rtu.baudRate) {
        Vue.delete(this.templateSpec.protocol.rtu, 'baudRate');
      }
    }
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
          v-model.number="templateSpec.protocol[transferMode].workerID"
          label="workerID"
        />
      </div>

      <template v-if="transferMode === 'rtu'">
        <div class="col span-6">
          <LabeledInput
            v-model="templateSpec.protocol[transferMode].endpoint"
            label="串口"
          />
        </div>
      </template>

      <template v-else>
        <div class="col span-6">
          <LabeledInput
            v-model="templateSpec.protocol[transferMode].endpoint"
            label="endpoint"
          />
        </div>
      </template>
    </div>

    <template v-if="transferMode === 'rtu'">
      <div class="row">
        <Checkbox
          v-model="isChoose"
          class="checkbox"
          label="添加RTU高级配置"
          type="checkbox"
        />
      </div>

      <template v-if="isChoose">
        <div class="row">
          <div class="col span-6">
            <LabeledInput
              v-model.number="templateSpec.protocol[transferMode].baudRate"
              label="baudRate"
            />
          </div>

          <div class="col span-6">
            <LabeledSelect
              v-model.number="templateSpec.protocol[transferMode].dataBits"
              label="dataBits"
              :options="dataBits"
            />
          </div>
        </div>

        <div class="row">
          <div class="col span-6">
            <LabeledSelect
              v-model.number="templateSpec.protocol[transferMode].parity"
              label="parity"
              :options="parity"
              :clearable="true"
            />
          </div>

          <div class="col span-6">
            <LabeledSelect
              v-model.number="templateSpec.protocol[transferMode].stopBits"
              label="stopBits"
              :options="stopBits"
              :clearable="true"
            />
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
