<script>
import _ from 'lodash';
import Vue from 'vue';
import LoadDeps from '@/mixins/load-deps';
import { sortBy } from '@/utils/sort';
import {
  BLUE_THOOTH_DEVICE, MODBUS_DEVICE_RTU, MODBUS_DEVICE_TCP, OPC_UA_DEVICE, MQTT_DEVICE, customDevice, extension
} from '@/edit/edge.cattle.io.devicelink/defaultYaml';
import Footer from '@/components/form/Footer';
import Tabbed from '@/components/Tabbed';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import CreateEditView from '@/mixins/create-edit-view';
import { allHash } from '@/utils/promise';
import InputWithSelect from '@/components/form/InputWithSelect';
import Tab from '@/components/Tabbed/Tab';
import BluetoothDeviceConfig from '@/edit/edge.cattle.io.devicelink/configuration/bluetooth';
import ModbusDeviceConfig from '@/edit/edge.cattle.io.devicelink/configuration/modbus';
import OPCUADeviceConfig from '@/edit/edge.cattle.io.devicelink/configuration/opcUa';
import MQTTDeviceConfig from '@/edit/edge.cattle.io.devicelink/configuration/mqtt';
import CustomConfig from '@/edit/edge.cattle.io.devicelink/configuration/custom';
import MqttConfig from '@/edit/edge.cattle.io.devicelink/mqtt/MqttConfig';
import DeviceProp from '@/edit/edge.cattle.io.devicelink/deviceProp';
import { DEVICE_TEMPLATE, SCHEMA, NAMESPACE, OFFICIAL_DEVICE } from '@/config/types';
import KeyValue from '@/components/form/KeyValue';
import { defaultAsyncData } from '@/components/ResourceDetail';
import { _CREATE, _EDIT } from '@/config/query-params';

const templateValue = {
  apiVersion: 'octopusapi.cattle.io/v1alpha1',
  kind:       'DeviceTemplate',
  metadata:   {
    name:      '',
    namespace: 'default'
  },
  spec: {
    deviceKind:          '',
    deviceVersion:       'v1alpha1',
    deviceGroup:         'devices.edge.cattle.io',
    deviceResource:      '',
    labels:              {},
    description:         '',
    defaultRevisionName: ''
  }
};

const versionValue = {
  apiVersion: 'octopusapi.cattle.io/v1alpha1',
  kind:       'DeviceTemplateRevision',
  metadata:   { namespace: 'default' },
  spec:       {
    displayName:              '',
    enable:                   true,
    deviceTemplateName:       '',
    deviceTemplateAPIVersion: 'octopusapi.cattle.io/v1alpha1',
    labels:                   {},
    references:               [],
    templateSpec:             {
      extension,
      protocol:   {},
      properties: []
    }
  }
};

export default {
  components: {
    KeyValue,
    Tabbed,
    Footer,
    InputWithSelect,
    LabeledInput,
    LabeledSelect,
    BluetoothDeviceConfig,
    ModbusDeviceConfig,
    OPCUADeviceConfig,
    MQTTDeviceConfig,
    MqttConfig,
    DeviceProp,
    CustomConfig,
    Tab,
  },

  mixins: [CreateEditView, LoadDeps],

  props:  {
    value: {
      type:     Object,
      required: true,
    },
  },

  asyncData(ctx) {
    let resource;

    if ( !ctx.params.id ) {
      resource = DEVICE_TEMPLATE.REVISION;
    }

    return defaultAsyncData(ctx, resource);
  },

  data() {
    const { devicesType } = this.$store.state;

    return {
      devicesType,
      templateValue: {},
      errors:        null,
      resources:     {},
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
    namespaces() {
      const choices = this.$store.getters['cluster/all'](NAMESPACE);

      const out = sortBy(choices.map((obj) => {
        return {
          label: obj.nameDisplay,
          value: obj.id,
        };
      }), 'label');

      return out;
    },
    kind() {
      return this.templateValue?.spec?.deviceKind;
    },
    isOfficialDevice() {
      return OFFICIAL_DEVICE.includes(this.kind);
    }
  },

  methods: {
    async loadDeps() {
      const resources = await allHash({
        template:   this.$store.dispatch('cluster/findAll', { type: DEVICE_TEMPLATE.TEMPLATE }),
        reviosn:    this.$store.dispatch('cluster/findAll', { type: DEVICE_TEMPLATE.REVISION }),
      });

      this.$set(this.value, 'spec', _.merge(_.cloneDeep(versionValue.spec), this.value.spec));
      let _templateValue = {};

      if (this.mode === _EDIT || this.mode === _CREATE) {
        const templateName = this.value.spec.deviceTemplateName;
        const templateNamespace = this.value.metadata.namespace;

        _templateValue = resources.template.filter( (T) => {
          return T.metadata.namespace === templateNamespace && T.metadata.name === templateName;
        })[0];
      }

      this.templateValue = _.merge(_.cloneDeep(templateValue), _templateValue);
      this.resources = resources;
    },
    async enable(buttonCb) {
      try {
        const { mode } = this.$route.query;
        const errors = this.$refs.mqttConfig.deleteUnuseProp();

        if (this.kind === 'ModbusDevice') {
          this.$refs.modbus.deleteData();
        }

        this.errors = errors;
        if (!errors.length) {
          if (this.mode === _CREATE && mode !== 'clone') {
            this.templateValue.spec.deviceResource = `${ this.templateValue.spec.deviceKind.toLowerCase() }s`;
            await this.$store.dispatch('management/request', {
              method:  'POST',
              headers: {
                'content-type': 'application/json',
                accept:         'application/json',
              },
              url:  `v1/octopusapi.cattle.io.devicetemplate`,
              data: this.templateValue,
            });
          }

          this.save(buttonCb);
        } else {
          buttonCb(false);

          return false;
        }
      } catch (err) {
        if ( err && err.response && err.response.data ) {
          const body = err.response.data;

          if ( body && body.message ) {
            this.errors = [body.message];
          } else {
            this.errors = [err];
          }
        } else {
          this.errors = [err];
        }

        buttonCb(false);
      }
    },
    changeNameAndNamespace(e) {
      this.templateValue.metadata.name = (e.text || '').toLowerCase();
      this.value.spec.deviceTemplateName = (e.text || '').toLowerCase();
      this.templateValue.metadata.namespace = e.selected;
      this.value.metadata.namespace = e.selected;
    },
    changeKind(kind) {
      if (kind === 'ModbusDevice') {
        this.$set(this.value.spec, 'templateSpec', _.cloneDeep(MODBUS_DEVICE_RTU.template.spec));
      } else if (kind === 'BluetoothDevice') {
        this.$set(this.value.spec, 'templateSpec', _.cloneDeep(BLUE_THOOTH_DEVICE.template.spec));
      } else if (kind === 'OPCUADevice') {
        this.$set(this.value.spec, 'templateSpec', _.cloneDeep(OPC_UA_DEVICE.template.spec));
      } else if (kind === 'MQTTDevice') {
        this.$set(this.value.spec, 'templateSpec', _.cloneDeep(MQTT_DEVICE.template.spec));
      } else {
        this.$set(this.value.spec, 'templateSpec', _.cloneDeep(customDevice.template.spec));

        this.$set(this.templateValue.spec, 'deviceKind', kind);
      }
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
        Vue.delete(this.value.spec.templateSpec, 'extension');
      } else {
        this.$set(this.value.spec.templateSpec, 'extension', extension);
      }
    }
  },

};
</script>

<template>
  <div>
    <div class="p-20">
      <form v-if="templateValue.metadata">
        <slot></slot>
        <div class="row">
          <div class="col span-4">
            <InputWithSelect
              :options="namespaces"
              text-label="Name"
              select-label="Namespace"
              :text-value="templateValue.metadata.name"
              :text-required="true"
              :select-value="templateValue.metadata.namespace"
              :mode="mode"
              :disabled="isEdit"
              @input="changeNameAndNamespace($event)"
            />
          </div>

          <div class="col span-4">
            <LabeledInput
              v-model="templateValue.spec.description"
              label="描述"
            />
          </div>

          <div class="col span-4">
            <LabeledInput
              v-model="value.spec.displayName"
              label="模版修订版本"
            />
          </div>
        </div>

        <div class="row">
          <div class="col span-4">
            <LabeledSelect
              v-model="templateValue.spec.deviceKind"
              label="设备类型"
              :options="deviceType"
              :disabled="isEdit"
              @input="changeKind"
            />
          </div>
        </div>
      </form>

      <Tabbed v-if="kind" v-bind="$attrs" class="mt-20 p-20 card-box-shadow">
        <Tab label="访问配置" name="config">
          <ModbusDeviceConfig
            v-if="kind === 'ModbusDevice'"
            ref="modbus"
            :template-spec="value.spec.templateSpec"
          />

          <BluetoothDeviceConfig
            v-else-if="kind === 'BluetoothDevice'"
            :template-spec="value.spec.templateSpec"
          />

          <OPCUADeviceConfig
            v-else-if="kind === 'OPCUADevice'"
            :template-spec="value.spec.templateSpec"
          />

          <MQTTDeviceConfig
            v-else-if="kind === 'MQTTDevice'"
            :template-spec="value.spec.templateSpec"
          />

          <CustomConfig
            v-else
            :mode="mode"
            :kind="kind"
            :template-spec="value.spec.templateSpec"
          />
        </Tab>

        <Tab label="设备属性" name="prop">
          <DeviceProp
            :kind="kind"
            :template-spec="value.spec.templateSpec"
            :is-official-device="isOfficialDevice"
          />
        </Tab>

        <Tab v-if="kind !== 'MQTTDevice'" label="MQTT" name="mqtt">
          <MqttConfig
            ref="mqttConfig"
            :template-spec="value.spec.templateSpec"
            :namespace="templateValue.metadata.namespace"
            :references="value.spec.references || []"
            @update:references="updateReferences"
            @update:extension="updateExtension"
          />
        </Tab>

        <Tab name="Labels" :label="t('common.labels')">
          <KeyValue
            key="labels"
            v-model="value.spec.labels"
            :mode="mode"
            :initial-empty-row="true"
            :pad-left="false"
            :read-allowed="false"
            :protip="false"
            class="pl-10"
          />
        </Tab>
      </Tabbed>
    </div>
    <Footer
      mode="create"
      :errors="errors"
      @save="enable"
      @done="done"
    />
  </div>
</template>
