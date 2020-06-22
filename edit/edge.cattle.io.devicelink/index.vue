<script>
import Vue from 'vue';
import _ from 'lodash';
import {
  BLUE_THOOTH_DEVICE, MODBUS_DEVICE_RTU, MODBUS_DEVICE_TCP, OPC_UA_DEVICE, customDevice
} from '@/edit/edge.cattle.io.devicelink/defaultYaml';
import { allHash } from '@/utils/promise';
import { NODE, NAMESPACES } from '@/config/types';
import { _EDIT, _CREATE } from '@/config/query-params';

import LoadDeps from '@/mixins/load-deps';
import createEditView from '@/mixins/create-edit-view';

import Tab from '@/components/Tabbed/Tab';
import Footer from '@/components/form/Footer';
import ResourceTabs from '@/components/form/ResourceTabs';
import LabeledSelect from '@/components/form/LabeledSelect';
import NameNsDescription from '@/components/form/NameNsDescription';

import BluetoothDeviceConfig from '@/edit/edge.cattle.io.devicelink/configuration/bluetooth';
import ModbusDeviceConfig from '@/edit/edge.cattle.io.devicelink/configuration/modbus';
import OPCUADeviceConfig from '@/edit/edge.cattle.io.devicelink/configuration/opcUa';
import CustomConfig from '@/edit/edge.cattle.io.devicelink/configuration/custom';
import MqttConfig from '@/edit/edge.cattle.io.devicelink/mqtt/MqttConfig';
import DeviceProp from '@/edit/edge.cattle.io.devicelink/deviceProp';

export default {
  components: {
    BluetoothDeviceConfig,
    ModbusDeviceConfig,
    OPCUADeviceConfig,
    MqttConfig,
    DeviceProp,
    CustomConfig,
    NameNsDescription,
    ResourceTabs,
    Tab,
    Footer,
    LabeledSelect
  },

  mixins: [createEditView, LoadDeps],

  data() {
    const { devicesType } = this.$store.state;

    if (this.mode === _CREATE) {
      this.$set(this.value, 'spec', _.cloneDeep(BLUE_THOOTH_DEVICE));
    }

    return {
      isChoose:      true,
      devicesType,
      allNodes:           [],
    };
  },

  computed: {
    isEdit() {
      return this.mode === _EDIT;
    },
    deviceType() {
      return this.devicesType.map((device) => {
        return {
          label: device.spec.names.kind,
          value: device.spec.names.kind
        };
      });
    },
    kind() {
      return this.value?.spec?.model?.kind;
    },
    isCustomDevice() {
      const deviceProtocol = ['ModbusDevice', 'BluetoothDevice', 'OPCUADevice'];
      const kind = this.value?.spec?.model?.kind;
      return !deviceProtocol.includes(kind);
    }
  },

  methods: {
    preventSubmit(e) {
      e.preventDefault(); // prevent form jumps (click add props)

      return false;
    },
    enable(buttonCb) {
      const errors = this.$refs.mqttConfig.deleteUnuseProp();

      this.errors = errors;
      // if (!this.isChoose && this.value.spec.template.spec.protocol.rtu) { // Delete unwanted data
      if (!errors.length) {
        // Vue.delete(this.value.spec.template.spec.protocol.rtu, 'baudRate');
        // Vue.delete(this.value.spec.template.spec.protocol.rtu, 'dataBits');
        // Vue.delete(this.value.spec.template.spec.protocol.rtu, 'parity');
        // Vue.delete(this.value.spec.template.spec.protocol.rtu, 'stopBits');

        this.save(buttonCb);
      } else {
        buttonCb(false);

        return false;
      }
    },
    async loadDeps() {
      const hash = await allHash({ nodes: this.$store.dispatch('management/findAll', { type: NODE, opt: { url: NODE } }) });

      const nodes = hash.nodes?.map((node) => {
        return {
          value: node.id,
          label: node.id
        };
      });

      this.allNodes = nodes;
    },
    changeKind(value) {
      if (value === 'ModbusDevice') {
        this.$set(this.value, 'spec', _.cloneDeep(MODBUS_DEVICE_RTU));
      } else if (value === 'BluetoothDevice') {
        this.$set(this.value, 'spec', _.cloneDeep(BLUE_THOOTH_DEVICE));
      } else if (value === 'OPCUADevice') {
        this.$set(this.value, 'spec', _.cloneDeep(OPC_UA_DEVICE));
      } else {
        this.$set(this.value, 'spec', _.cloneDeep(customDevice));

        const resource = this.devicesType.filter((D) => {
          if (D.spec.names.kind === value) {
            return D;
          }
        });
        const kind = resource[0].spec.names.kind;
        console.log('-----resource', resource)
        this.$set(this.value.spec.adaptor, 'name', `adaptors.edge.cattle.io/${ kind.toLowerCase() }`);
        this.$set(this.value.spec.model, 'kind', kind);
      }

      const node = this.value.spec.adaptor.node;

      this.$set(this.value.spec.adaptor, 'node', node);
    },
  }
};
</script>

<template>
  <div>
    <form @submit="preventSubmit">
      <slot :value="value" name="top">
        <NameNsDescription v-model="value" :mode="mode" :extra-columns="['type']">
          <template v-slot:type>
            <LabeledSelect
              v-model="value.spec.model.kind"
              label="设备类型"
              :options="deviceType"
              :disabled="isEdit"
              @input="changeKind"
            />
          </template>
        </NameNsDescription>
        
        <div class="row">
          <div class="col span-4">
            <LabeledSelect v-model="value.spec.adaptor.node" label="节点" :options="allNodes" />
          </div>
        </div>
      </slot>

      <ResourceTabs v-model="value" :mode="mode" default-tab="config">
        <template #before>
          <Tab label="访问配置" name="config">
            <component v-if="!isCustomDevice" :is="`${kind}Config`" :value="value" />

            <CustomConfig v-else :value="value" :mode="mode" />
          </Tab>

          <Tab label="设备属性" name="prop">
            <DeviceProp :value="value" />
          </Tab>

          <Tab label="MQTT" name="mqtt">
            <MqttConfig ref="mqttConfig" :value="value" />
          </Tab>
        </template>
      </ResourceTabs>

      <Footer :errors="errors" :mode="mode" @save="enable" @done="done" />
    </form>
  </div>
</template>
