<script>
import _ from 'lodash';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import ButtonGroup from '@/components/ButtonGroup';
import { parity, dataBits, deviceDefaultInfo } from '@/config/map';
import { MODBUS_DEVICE_RTU, MODBUS_DEVICE_TCP } from '@/edit/edge.cattle.io.devicelink/defaultYaml';

export default {
  components: {
    ButtonGroup,
    LabeledInput,
    LabeledSelect
  },

  props: {
    value: {
      type:     Object,
      required: true,
    },
  },

  data() {
    console.log('------value modbus', _.clone(this.value))
    return {
      stopBits: [
        { label: 1, value: 1 },
        { label: 2, value: 2 }
      ],
      parity,
      dataBits,
      deviceDefaultInfo,
      isChoose: true,
      tempSpec: {},
    };
  },

  computed: {
    isModeReady() {
      return !!this.value.spec.template.spec.protocol?.tcp || !!this.value.spec.template.spec.protocol?.rtu;
    },
    transferMode: {
      get() {
        if (this.value.spec.template.spec.protocol?.tcp) {
          return 'tcp';
        } else if (this.value.spec.template.spec.protocol?.rtu) {
          return 'rtu';
        }

        return 'rtu';
      },
      set(v) {
        this.changeTransferMode(v);

        return v;
      }
    },
  },

  methods: {
    changeTransferMode(mode) {
      const tempSpec = _.cloneDeep(this.value.spec);
      const node = this.value.spec.adaptor.node;

      if (Object.keys(this.tempSpec).length > 0) {
        this.$set(this.value, 'spec', _.cloneDeep(this.tempSpec));
      } else {
        mode === 'rtu'
          ? this.$set(this.value, 'spec', _.cloneDeep(MODBUS_DEVICE_RTU))
          : this.$set(this.value, 'spec', _.cloneDeep(MODBUS_DEVICE_TCP));
      }
      this.$set(this.value.spec.adaptor, 'node', node);
      this.tempSpec = tempSpec;
    }
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-6">
        <ButtonGroup :value="transferMode" :options="[{label: 'TCP', value: 'tcp'}, {label: 'RTU', value: 'rtu'}]" @input="changeTransferMode" />
      </div>

      <div class="col span-6">
        <LabeledInput
          v-model.number="value.spec.template.spec.protocol[transferMode].slaveID"
          label="SlaveID"
          mode="create"
        />
      </div>
    </div>

    <div class="row">
      <template v-if="transferMode === 'rtu'">
        <div class="col span-6">
          <LabeledInput
            v-model="value.spec.template.spec.protocol[transferMode].serialPort"
            label="串口"
            mode="create"
          />
        </div>
      </template>

      <template v-else>
        <div class="col span-6">
          <LabeledInput
            v-model="value.spec.template.spec.protocol[transferMode].ip"
            label="IP"
            mode="create"
          />
        </div>

        <div class="col span-6">
          <LabeledInput
            v-model.number="value.spec.template.spec.protocol[transferMode].port"
            label="Port"
            mode="create"
          />
        </div>
      </template>
    </div>

    <template v-if="transferMode === 'rtu'">
      <div class="row">
        <label class="checkbox-container" mode="create" type="checkbox">
          <label class="checkbox-box">
            <input v-model="isChoose" type="checkbox" tabindex="-1"> <span tabindex="0" aria-label="Interactive" role="checkbox" class="checkbox-custom"></span>
          </label>
          <span class="checkbox-label">添加RTU高级配置</span>
        </label>
      </div>

      <template v-if="isChoose">
        <div class="row">
          <div class="col span-6">
            <LabeledInput
              v-model.number="value.spec.template.spec.protocol[transferMode].baudRate"
              label="baudRate"
              mode="create"
            />
          </div>

          <div class="col span-6">
            <LabeledSelect v-model.number="value.spec.template.spec.protocol[transferMode].dataBits" label="dataBits" :options="dataBits" />
          </div>
        </div>

        <div class="row">
          <div class="col span-6">
            <LabeledSelect v-model.number="value.spec.template.spec.protocol[transferMode].parity" label="parity" :options="parity" :clearable="true" />
          </div>

          <div class="col span-6">
            <LabeledSelect v-model.number="value.spec.template.spec.protocol[transferMode].stopBits" label="stopBits" :options="stopBits" :clearable="true" />
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
