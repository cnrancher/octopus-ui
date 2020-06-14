<script>
/* eslint-disable */
import Vue from 'vue';
import _ from 'lodash';
import {
  BLUE_THOOTH_DEVICE,
  MODBUS_DEVICE_RTU,
  MODBUS_DEVICE_TCP,
  OPC_UA_DEVICE,
  customDevice,
} from './defaultYaml';
import { allHash } from '@/utils/promise';
import { NODE, NAMESPACES } from '@/config/types';
import { _EDIT } from '@/config/query-params';

import LoadDeps from '@/mixins/load-deps';
import createEditView from '@/mixins/create-edit-view';

import Tab from '@/components/Tabbed/Tab';
import Footer from '@/components/form/Footer';
import ResourceTabs from '@/components/form/ResourceTabs';
import LabeledSelect from '@/components/form/LabeledSelect';
import NameNsDescription from '@/components/form/NameNsDescription';

import BluetoothConfig from '@/edit/edge.cattle.io.devicelink/configuration/bluetooth';
import ModbusConfig from '@/edit/edge.cattle.io.devicelink/configuration/modbus';
import OpcUaConfig from '@/edit/edge.cattle.io.devicelink/configuration/opcUa';
import CustomConfig from '@/edit/edge.cattle.io.devicelink/configuration/custom';
import MqttConfig from '@/edit/edge.cattle.io.devicelink/mqtt/MqttConfig';
import DeviceProp from '@/edit/edge.cattle.io.devicelink/deviceProp';
import CustomTemplate from '@/edit/edge.cattle.io.devicelink/custom/templates';

export default {
  components: {
    BluetoothConfig,
    ModbusConfig,
    OpcUaConfig,
    MqttConfig,
    DeviceProp,
    CustomConfig,
    NameNsDescription,
    ResourceTabs,
    Tab,
    Footer,
    CustomTemplate,
    LabeledSelect
  },
  mixins:     [createEditView, LoadDeps],
  data() {
    const { devicesType } = this.$store.state;
    const { mode } = this.$route.query;

    if (this.value.metadata && !(mode === _EDIT)) {
      this.$set(this.value, 'spec', _.cloneDeep(BLUE_THOOTH_DEVICE));
    }
    
    return {
      node: this.value.spec.adaptor.node,
      isChoose: true,
      devicesType,
      tempSpec:           {},
      activeNames:        ['1'],
      dialogVisible:      false,
      editRowIndex:       -1,
      allNodes:           [],
      allNamespace:       [],
      templateProtocol:   {},
      templateProperties: {},
    };
  },
  computed: {
    isEdit() {
      return this.mode === _EDIT;
    },
    deviceType() {
      return this.devicesType.map(device => {
        return { label: device.spec.names.kind, value: device.spec.names.kind }
      });
    },
    isModeReady() {
      return !!this.value.spec.template.spec.protocol?.tcp || !!this.value.spec.template.spec.protocol?.rtu;
    },
    isCustomProtocol() {
      const deviceProtocol = ['ModbusDevice', 'BluetoothDevice', 'OPCUADevice'];
      const kind = this.value.spec.model.kind;

      return deviceProtocol.includes(kind);
    },
  },
  watch: {
    node(newV) {
      this.value.spec.adaptor.node = newV;
    }
  },
  methods: {
    preventSubmit(e) {
      e.preventDefault(); // prevent form jumps (click add props)
      return false;
    },
    enable(buttonCb) {
      if (!this.isChoose && this.value.spec.template.spec.protocol.rtu) { // Delete unwanted data
        Vue.delete(this.value.spec.template.spec.protocol.rtu, 'baudRate');
        Vue.delete(this.value.spec.template.spec.protocol.rtu, 'dataBits');
        Vue.delete(this.value.spec.template.spec.protocol.rtu, 'parity');
        Vue.delete(this.value.spec.template.spec.protocol.rtu, 'stopBits');

        this.save(buttonCb);
      } else {
        buttonCb(false);

        return false;
      }
    },
    async loadDeps() {
      const hash = await allHash({
        nodes:      this.$store.dispatch('management/findAll', { type: NODE, opt: { url: NODE } }),
        namespaces:  this.$store.dispatch('management/findAll', { type: NAMESPACES, opt: { url: NAMESPACES } }),
      });
      const nodes = hash.nodes?.map((node) => {
        return {
          value: node.id,
          label: node.id
        };
      });

      this.node = nodes[0].value;
      const namespaces = hash.namespaces?.map( (NS) => {
        return {
          value: NS.id,
          label: NS.id
        };
      });

      this.allNodes = nodes;
      this.allNamespace = namespaces;
    },
    changeKind(value) {
      if (value === 'ModbusDevice') {
        this.$set(this.value, 'spec', _.cloneDeep(MODBUS_DEVICE_RTU));
      } else if (value === 'BluetoothDevice') {
        this.$set(this.value, 'spec', _.cloneDeep(BLUE_THOOTH_DEVICE));
      } else if (value === 'OPCUADevice') {
        this.$set(this.value, 'spec', _.cloneDeep(OPC_UA_DEVICE));
        console.log('----opc', _.cloneDeep(OPC_UA_DEVICE))
      } else {
        const resource = this.devicesType.filter((D) => {
          if (D.spec.names.kind === value) {
            return D;
          }
        });

        const kind = resource[0].spec.names.kind;
        const spec = resource[0].spec.versions[0].schema.openAPIV3Schema.properties.spec.properties;
        console.log('----resource 自定义设备用到的spec', spec);

        this.$set(this.value, 'spec', _.cloneDeep(customDevice));
        this.$set(this.value, 'spec.adaptor.name', `adaptors.edge.cattle.io/${ kind.toLowerCase() }`);
        this.$set(this.value, 'spec.model.kind', kind);

        this.$set(this, 'templateProtocol', _.cloneDeep(spec.protocol));
        this.$set(this, 'templateProperties', _.cloneDeep(spec.properties.items) || []);
      }

      const node = this.value.spec.adaptor.node;
      this.$set(this.value.spec.adaptor, 'node', node)
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
            <LabeledSelect v-model="value.spec.model.kind" label="设备类型" :options="deviceType" @input="changeKind" />
          </template>
        </NameNsDescription>
        <div class="row">
          <div class="col span-4">
            <LabeledSelect v-model="node" label="节点" :options="allNodes" />
          </div>
          <div class="col span-4" />
        </div>
      </slot>

      <ResourceTabs v-model="value" :mode="mode" default-tab="config">
        <template #before>
          <Tab label="访问配置" name="config">
            <template v-if="value.spec.model.kind === 'BluetoothDevice'">
              <BluetoothConfig :value="value" />
            </template>

            <template
              v-else-if="value.spec.model.kind === 'ModbusDevice' && value.spec.template.spec.protocol"
            >
              <ModbusConfig v-if="isModeReady" :value="value" />
            </template>

            <template v-else-if="value.spec.model.kind === 'OPCUADevice' && value.spec.template.spec.protocol">
              <OpcUaConfig :value="value" />
            </template>

            <template v-else>
              <CustomConfig 
                :value="value"
                :template-protocol="templateProtocol"
              />
            </template>
          </Tab>

          <Tab label="设备属性" name="prop">
            <DeviceProp
              :value="value" 
              :template-properties="templateProperties" 
            />
          </Tab>

          <Tab label="MQTT" name="mqtt">
            <MqttConfig :value="value" />
          </Tab>
        </template>
      </ResourceTabs>

      <Footer v-if="mode!= 'view'" :errors="errors" :mode="mode" @save="save" @done="done" />

    </form>
  </div>
</template>
