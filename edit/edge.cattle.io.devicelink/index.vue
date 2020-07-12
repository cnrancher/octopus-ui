<script>
import Vue from 'vue';
import _ from 'lodash';
import {
  BLUE_THOOTH_DEVICE, MODBUS_DEVICE_RTU, MODBUS_DEVICE_TCP, OPC_UA_DEVICE, MQTT_DEVICE, customDevice
} from '@/edit/edge.cattle.io.devicelink/defaultYaml';
import { allHash } from '@/utils/promise';
import { sortBy } from '@/utils/sort';
import { NODE, NAMESPACES, DEVICE_TEMPLATE, OFFICIAL_DEVICE } from '@/config/types';
import { _EDIT, _CREATE } from '@/config/query-params';

import LoadDeps from '@/mixins/load-deps';
import createEditView from '@/mixins/create-edit-view';

import Tab from '@/components/Tabbed/Tab';
import Footer from '@/components/form/Footer';
import Checkbox from '@/components/form/Checkbox';
import ResourceTabs from '@/components/form/ResourceTabs';
import LabeledSelect from '@/components/form/LabeledSelect';
import NameNsDescription from '@/components/form/NameNsDescription';

import DeviceProp from '@/edit/edge.cattle.io.devicelink/deviceProp';
import MqttConfig from '@/edit/edge.cattle.io.devicelink/mqtt/MqttConfig';
import CustomConfig from '@/edit/edge.cattle.io.devicelink/configuration/custom';
import OPCUADeviceConfig from '@/edit/edge.cattle.io.devicelink/configuration/opcUa';
import ModbusDeviceConfig from '@/edit/edge.cattle.io.devicelink/configuration/modbus';
import MQTTDeviceConfig from '@/edit/edge.cattle.io.devicelink/configuration/mqtt';
import BluetoothDeviceConfig from '@/edit/edge.cattle.io.devicelink/configuration/bluetooth';

export default {
  components: {
    Tab,
    Footer,
    Checkbox,
    MqttConfig,
    DeviceProp,
    CustomConfig,
    ResourceTabs,
    LabeledSelect,
    NameNsDescription,
    OPCUADeviceConfig,
    ModbusDeviceConfig,
    MQTTDeviceConfig,
    BluetoothDeviceConfig,
  },

  mixins: [createEditView, LoadDeps],

  data() {
    const { devicesType = [] } = this.$store.state;

    if (this.mode === _CREATE) {
      this.$set(this.value, 'spec', _.cloneDeep(BLUE_THOOTH_DEVICE));
    }

    if (this.mode === _EDIT) {
      this.getDeviceTemplate(this.value.spec.model.kind);
    }

    return {
      devicesType,
      allNodes:        [],
      allVersion:      [],
      allTemplate:     [],
      templateName:    '',
      templateVersion: '',
      isChoose:        true,
      isUseTemplate:   false
    };
  },

  computed: {
    isEdit() {
      return this.mode === _EDIT;
    },
    kind() {
      return this.value.spec.model.kind;
    },
    isOfficialDevice() {
      return OFFICIAL_DEVICE.includes(this.kind);
    },
    deviceTypeOption() {
      return this.devicesType.map((device) => {
        return {
          label: device.spec.names.kind,
          value: device.spec.names.kind
        };
      });
    },
    templateVersionOption() {
      return sortBy(
        this.allVersion
          .filter(O => O.spec.deviceTemplateName === this.templateName)
          .map((O) => {
            return {
              label: O.spec.displayName,
              value: O.spec.displayName
            };
          }),
        'label'
      );
    },
    templateOption() {
      return sortBy(
        this.allTemplate
          .filter( T => T.spec.deviceKind === this.kind)
          .map((T) => {
            return {
              value: T.metadata.name,
              label: T.metadata.name
            };
          }),
        'label'
      );
    },
    nodeOption() {
      return sortBy(
        this.allNodes.map( (N) => {
          return {
            value: N.id,
            label: N.id
          };
        }),
        'label'
      );
    }
  },

  methods: {
    preventSubmit(e) {
      e.preventDefault(); // prevent form jumps (click add props)

      return false;
    },
    getDeviceTemplate(kind) {
      if (kind === 'ModbusDevice') {
        if (this.value.spec.template.spec.protocol.tcp) {
          this.$set(this.value, 'spec', _.merge(_.cloneDeep(MODBUS_DEVICE_TCP), this.value.spec));
        } else {
          this.$set(this.value, 'spec', _.merge(_.cloneDeep(MODBUS_DEVICE_RTU), this.value.spec));
        }
      } else if (kind === 'BluetoothDevice') {
        this.$set(this.value, 'spec', _.merge(_.cloneDeep(BLUE_THOOTH_DEVICE), this.value.spec));
      } else if (kind === 'OPCUADevice') {
        this.$set(this.value, 'spec', _.merge(_.cloneDeep(OPC_UA_DEVICE), this.value.spec));
      } else if (kind === 'MQTTDevice') {
        this.$set(this.value, 'spec', _.merge(_.cloneDeep(MQTT_DEVICE), this.value.spec));
      } else {
        this.$set(this.value, 'spec', _.merge(_.cloneDeep(customDevice), this.value.spec));
      }
    },
    enable(buttonCb) {
      let errors = [];

      if (this.kind !== 'MQTTDevice') {
        errors = this.$refs?.mqttConfig.deleteUnuseProp();
      }

      if (this.kind === 'ModbusDevice') {
        this.$refs.modbus.deleteData();
      }
      // TODO need callback method
      this.errors = errors;
      if (!errors.length) {
        this.save(buttonCb);
      } else {
        buttonCb(false);

        return false;
      }
    },
    async loadDeps() {
      const hash = await allHash({
        nodes:    this.$store.dispatch('cluster/findAll', { type: NODE }),
        template: this.$store.dispatch('management/findAll', { type: DEVICE_TEMPLATE.TEMPLATE }),
        version:  this.$store.dispatch('management/findAll', { type: DEVICE_TEMPLATE.REVISION })
      });

      this.allNodes = hash.nodes;
      this.allTemplate = hash.template;
      this.allVersion = hash.version;
    },
    changeKind(kind) {
      this.templateName = '';
      this.templateVersion = '';
      const { node } = this.value.spec.adaptor;

      if (kind === 'ModbusDevice') {
        this.$set(this.value, 'spec', _.cloneDeep(MODBUS_DEVICE_RTU));
      } else if (kind === 'BluetoothDevice') {
        this.$set(this.value, 'spec', _.cloneDeep(BLUE_THOOTH_DEVICE));
      } else if (kind === 'OPCUADevice') {
        this.$set(this.value, 'spec', _.cloneDeep(OPC_UA_DEVICE));
      } else if (kind === 'MQTTDevice') {
        this.$set(this.value, 'spec', _.cloneDeep(MQTT_DEVICE));
      } else {
        this.$set(this.value, 'spec', _.cloneDeep(customDevice));

        this.$set(this.value.spec.adaptor, 'name', `adaptors.edge.cattle.io/${ kind.toLowerCase() }`);
        this.$set(this.value.spec.model, 'kind', kind);
      }

      this.$set(this.value.spec.adaptor, 'node', node);
    },
    changeTemplate(value) {
      this.templateVersion = '';
    },
    changeVersion(value) {
      const template = this.allVersion.find( (T) => {
        return this.templateName === T.spec.deviceTemplateName && value === T.spec.displayName;
      });

      this.$set(this.value.spec.template, 'spec', _.cloneDeep(template.spec.templateSpec));
    },
    updateReferences(references) {
      if (references.length) {
        this.$set(this.value.spec, 'references', references);
      } else {
        Vue.delete(this.value.spec, 'references');
      }
    },
    updateExtension(extension) {
      if (extension === 'empty') {
        Vue.delete(this.value.spec.template.spec, 'extension');
      } else {
        this.$set(this.value.spec.template.spec, 'extension', extension);
      }
    }
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
              :options="deviceTypeOption"
              :disabled="isEdit"
              @input="changeKind"
            />
          </template>
        </NameNsDescription>

        <div class="row">
          <div class="col span-4">
            <LabeledSelect v-model="value.spec.adaptor.node" label="节点" :options="nodeOption" />
          </div>
        </div>
      </slot>

      <div>
        <Checkbox
          v-model="isUseTemplate"
          class="checkbox"
          label="使用现有的设备模板和修订"
          type="checkbox"
        />
      </div>

      <div v-if="isUseTemplate" class="row">
        <div class="col span-6">
          <LabeledSelect
            v-model="templateName"
            label="设备模版"
            :options="templateOption"
            @input="changeTemplate"
          />
        </div>

        <div class="col span-6">
          <LabeledSelect
            v-model="templateVersion"
            label="设备模版版本"
            :options="templateVersionOption"
            @input="changeVersion"
          />
        </div>
      </div>

      <ResourceTabs :key="kind" v-model="value" :mode="mode" default-tab="config">
        <template #before>
          <Tab label="访问配置" name="config">
            <ModbusDeviceConfig
              v-if="kind === 'ModbusDevice'"
              ref="modbus"
              :template-spec="value.spec.template.spec"
            />

            <BluetoothDeviceConfig
              v-else-if="kind === 'BluetoothDevice'"
              :template-spec="value.spec.template.spec"
            />

            <OPCUADeviceConfig
              v-else-if="kind === 'OPCUADevice'"
              :template-spec="value.spec.template.spec"
            />

            <MQTTDeviceConfig
              v-else-if="kind === 'MQTTDevice'"
              :template-spec="value.spec.template.spec"
            />

            <CustomConfig
              v-else
              :mode="mode"
              :kind="kind"
              :template-spec="value.spec.template.spec"
            />
          </Tab>

          <Tab label="设备属性" name="prop">
            <DeviceProp
              :value="value"
              :kind="kind"
              :template-spec="value.spec.template.spec"
              :is-official-device="isOfficialDevice"
            />
          </Tab>

          <Tab v-if="kind !== 'MQTTDevice'" label="MQTT" name="mqtt">
            <MqttConfig
              ref="mqttConfig"
              :template-spec="value.spec.template.spec"
              :namespace="value.metadata.namespace"
              :references="value.spec.references || []"
              @update:references="updateReferences"
              @update:extension="updateExtension"
            />
          </Tab>
        </template>
      </ResourceTabs>

      <Footer :errors="errors" :mode="mode" @save="enable" @done="done" />
    </form>
  </div>
</template>
