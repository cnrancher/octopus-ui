<script>
import _ from 'lodash';
import { sortBy } from '@/utils/sort';
import {
  BLUE_THOOTH_DEVICE, MODBUS_DEVICE_RTU, MODBUS_DEVICE_TCP, OPC_UA_DEVICE, customDevice, extension
} from '@/edit/edge.cattle.io.devicelink/defaultYaml';
import Footer from '@/components/form/Footer';
import Tabbed from '@/components/Tabbed';
import BreadCrumbs from '@/components/BreadCrumbs';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import CreateEditView from '@/mixins/create-edit-view';
import { allHash } from '@/utils/promise';
import InputWithSelect from '@/components/form/InputWithSelect';
import Tab from '@/components/Tabbed/Tab';
import BluetoothDeviceConfig from '@/edit/edge.cattle.io.devicelink/configuration/bluetooth';
import ModbusDeviceConfig from '@/edit/edge.cattle.io.devicelink/configuration/modbus';
import OPCUADeviceConfig from '@/edit/edge.cattle.io.devicelink/configuration/opcUa';
import CustomConfig from '@/edit/edge.cattle.io.devicelink/configuration/custom';
import MqttConfig from '@/edit/edge.cattle.io.devicelink/mqtt/MqttConfig';
import DeviceProp from '@/edit/edge.cattle.io.devicelink/deviceProp';
import { DEVICE_TEMPLATE, SCHEMA, NAMESPACE, OFFICIAL_DEVICE } from '@/config/types';
import KeyValue from '@/components/form/KeyValue';

const templateValue = {
  apiVersion: 'edgeapi.cattle.io/v1alpha1',
  kind:       'DeviceTemplate',
  metadata:   {
    name:      '',
    namespace: 'default'
  },
  spec: {
    deviceKind:          '',
    deviceVersion:       '',
    deviceGroup:         'devices.edge.cattle.io',
    deviceResource:      '', // ModbusDevice
    labels:              {},
    description:         '',
    defaultRevisionName: ''
  }
};

const versionValue = {
  apiVersion: 'edgeapi.cattle.io/v1alpha1',
  kind:       'DeviceTemplateRevision',
  metadata:   { namespace: 'default' },
  spec:       {
    displayName:              '',
    enable:                   true,
    deviceTemplateName:       '',
    deviceTemplateAPIVersion: 'edgeapi.cattle.io/v1alpha1',
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
    BreadCrumbs,
    BluetoothDeviceConfig,
    ModbusDeviceConfig,
    OPCUADeviceConfig,
    MqttConfig,
    DeviceProp,
    CustomConfig,
    Tab,
  },

  mixins: { CreateEditView },

  async asyncData({ store }) {
    const resources = await allHash({
      template:   store.dispatch('cluster/findAll', { type: DEVICE_TEMPLATE.TEMPLATE }),
      reviosn:    store.dispatch('cluster/findAll', { type: DEVICE_TEMPLATE.REVISION }),
    });

    return { resources };
  },

  data() {
    const { devicesType } = this.$store.state;

    return {
      mode:   'create',
      devicesType,
      route:         this.$route,
      errors:        null,
      templateValue,
      versionValue
    };
  },

  computed: {
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
      return this.templateValue.spec.deviceKind;
    },
    isOfficialDevice() {
      return OFFICIAL_DEVICE.includes(this.kind);
    },
  },

  methods: {
    async save(buttonDone) {
      try {
        await this.$store.dispatch('management/request', {
          method:  'POST',
          headers: {
            'content-type': 'application/json',
            accept:         'application/json',
          },
          url:  `v1/edgeapi.cattle.io.devicetemplate`,
          data: this.templateValue,
        });

        await this.$store.dispatch('management/request', {
          method:  'POST',
          headers: {
            'content-type': 'application/json',
            accept:         'application/json',
          },
          url:  `v1/edgeapi.cattle.io.devicetemplaterevision`,
          data: this.versionValue,
        });

        buttonDone(true);
        this.done();
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

        buttonDone(false);
      }
    },
    done() {
      this.$router.replace({
        name:   'c-cluster-resource',
        params: { resource: 'template' }
      });
    },
    changeNameAndNamespace(e) {
      this.templateValue.metadata.name = (e.text || '').toLowerCase();
      this.versionValue.spec.deviceTemplateName = (e.text || '').toLowerCase();
      this.templateValue.metadata.namespace = e.selected;
    },
    changeKind(kind) {
      if (kind === 'ModbusDevice') {
        this.$set(this.versionValue.spec, 'templateSpec', _.cloneDeep(MODBUS_DEVICE_RTU.template.spec));
      } else if (kind === 'BluetoothDevice') {
        this.$set(this.versionValue.spec, 'templateSpec', _.cloneDeep(BLUE_THOOTH_DEVICE.template.spec));
      } else if (kind === 'OPCUADevice') {
        this.$set(this.versionValue.spec, 'templateSpec', _.cloneDeep(OPC_UA_DEVICE.template.spec));
      } else {
        this.$set(this.versionValue.spec, 'templateSpec', _.cloneDeep(customDevice.template.spec));

        this.$set(this.templateValue.spec, 'deviceKind', kind);
      }
    },
  },

};
</script>

<template>
  <div>
    <header>
      <BreadCrumbs class="breadcrumbs" :route="route" />

      <h1 class="p-20">
        Create Template
      </h1>
    </header>

    <div class="p-20">
      <form>
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
              v-model="templateValue.spec.deviceVersion"
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
            :template-spec="versionValue.spec.templateSpec"
          />

          <BluetoothDeviceConfig
            v-else-if="kind === 'BluetoothDevice'"
            :template-spec="versionValue.spec.templateSpec"
          />

          <OPCUADeviceConfig
            v-else-if="kind === 'OPCUADevice'"
            :template-spec="versionValue.spec.templateSpec"
          />

          <CustomConfig
            v-else
            :mode="mode"
            :kind="kind"
            :template-spec="versionValue.spec.templateSpec"
          />
        </Tab>

        <Tab label="设备属性" name="prop">
          <DeviceProp
            :value="versionValue"
            :kind="kind"
            :template-spec="versionValue.spec.templateSpec"
            :is-official-device="isOfficialDevice"
          />
        </Tab>

        <Tab label="MQTT" name="mqtt">
          <MqttConfig
            ref="mqttConfig"
            :template-spec="versionValue.spec.templateSpec"
            :namespace="templateValue.metadata.namespace"
            :references="versionValue.spec.references"
          />
        </Tab>

        <Tab name="Labels" :label="t('common.labels')">
          <KeyValue
            key="labels"
            v-model="versionValue.spec.labels"
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
      @save="save"
      @done="done"
    />
  </div>
</template>
