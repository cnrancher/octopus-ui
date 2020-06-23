<script>
import jsyaml from 'js-yaml';
import CodeMirror from '@/components/CodeMirror';
import { sortBy } from '@/utils/sort';
import Footer from '@/components/form/Footer';
import BreadCrumbs from '@/components/BreadCrumbs';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import CreateEditView from '@/mixins/create-edit-view';
import { allHash } from '@/utils/promise';
import InputWithSelect from '@/components/form/InputWithSelect';
import { DEVICE_TEMPLATE, SCHEMA, NAMESPACE } from '@/config/types';

export default {
  components: {
    Footer,
    InputWithSelect,
    LabeledInput,
    LabeledSelect,
    BreadCrumbs,
  },

  mixins: { CreateEditView },

  async asyncData({ store }) {
    const resources = await allHash({
      template:             store.dispatch('cluster/findAll', { type: DEVICE_TEMPLATE.TEMPLATE }),
      reviosn:              store.dispatch('cluster/findAll', { type: DEVICE_TEMPLATE.REVISION }),
    });

    return { resources };
  },

  data() {
    const { devicesType } = this.$store.state;

    return {
      devicesType,
      route:         this.$route,
      errors:        null,
      templateValue:  {
        apiVersion: 'edgeapi.cattle.io/v1alpha1',
        kind:       'DeviceTemplate',
        metadata:   {
          name:      '',
          namespace: 'default'
        },
        spec: {
          deviceKind:          'ModbusDevice',
          deviceVersion:       '',
          deviceGroup:         'devices.edge.cattle.io',
          deviceResource:      'modbusdevices',
          labels:              { foo: 'bar' },
          description:         '',
          defaultRevisionName: ''
        }
      }
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
  },

  methods: {
    save(buttonDone) {

    },
    done() {
      this.$router.replace({
        name:   'c-cluster-resource',
        params: { resource: 'template' }
      });
    },
    changeNameAndNamespace(e) {
      this.templateValue.metadata.name = (e.text || '').toLowerCase();
      this.templateValue.metadata.namespace = e.selected;
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
              :disabled="nameDisabled"
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
            />
          </div>
        </div>
      </form>
    </div>

    <Footer
      mode="create"
      :errors="errors"
      @save="save"
      @done="done"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
