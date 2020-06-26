<script>
import _ from 'lodash';
import OPCUADeviceModel from '@/edit/edge.cattle.io.devicelink/model/OpcUaModel';
import ModbusDeviceModel from '@/edit/edge.cattle.io.devicelink/model/ModbusModel';
import CustomModel from '@/edit/edge.cattle.io.devicelink/custom/CustomModel';
import BluetoothDeviceModel from '@/edit/edge.cattle.io.devicelink/model/BluetoothModel';
import AddTable from '@/edit/edge.cattle.io.devicelink/deviceProp/AddTable';
import {
  BluetoothDeviceHeader,
  ModbusDeviceHeader,
  OPCUADeviceHeader,
  CUSTOMDeviceHeader
} from '@/edit/edge.cattle.io.devicelink/type-header';
import { OFFICIAL_DEVICE } from '@/config/types';
import { customDevice } from '@/edit/edge.cattle.io.devicelink/defaultYaml';

const _extension = {
  mqtt: {
    client: {
      server:          '',
      protocolVersion: 3,
      will:            {
        topicName:      '',
        payloadEncode:  'raw',
        qos:            0,
        payloadContent: '',
        retained:       false
      },
      basicAuth: {
        name:      '',
        password: ''
      },
      tlsConfig: {
        caFilePem:          '',
        certFilePem:        '',
        keyFilePem:         '',
        insecureSkipVerify: false,
        serverName:         '',
        caFilePEMRef:       {
          item: '',
          name: ''
        },
        certFilePEMRef: {
          item: '',
          name: ''
        },
        keyFilePEMRef: {
          item: '',
          name: ''
        }
      },
      store:           {
        type:            'memory',
        direcotryPrefix: '/var/run/octopus/mqtt',
      },
    },
    message: {
      topic: {
        name:   '',
        prefix: '',
        with:   'nn'
      },
      topicName:     '',
      payloadEncode: 'raw',
      qos:           0,
      retained:      true,
    }
  }
};

export default {
  components: {
    AddTable,
    CustomModel,
    OPCUADeviceModel,
    ModbusDeviceModel,
    BluetoothDeviceModel
  },

  props: {
    templateSpec: {
      type:     Object,
      required: true,
    },
    kind: {
      type:     String,
      required: true
    },
    isOfficialDevice: {
      type:     Boolean,
      required: true
    }
  },

  data() {
    const { devicesType } = this.$store.state;
    const { extension } = this.templateSpec;

    if (!extension) {
      this.$set(this.templateSpec, 'extension', _extension);
    }

    this.$set(this.templateSpec, 'extension', _.merge(_extension, extension));

    return {
      headers: {
        BluetoothDeviceHeader,
        ModbusDeviceHeader,
        OPCUADeviceHeader
      },
      devicesType,
      dialogVisible: false,
      editRowIndex:  0,
      dialogModel:   'create'
    };
  },

  computed: {
    currentHeader() {
      return this.isOfficialDevice ? this.headers[`${ this.kind }Header`] : CUSTOMDeviceHeader;
    },
    templateProperties() {
      const resource = this.devicesType.filter((D) => {
        if (D.spec.names.kind === this.kind) {
          return D;
        }
      });
      const spec = resource[0].spec.versions[0].schema.openAPIV3Schema.properties.spec.properties;

      if (!this.isOfficialDevice) {
        this.$set(this.templateSpec, 'properties', _.cloneDeep(customDevice.template.spec.properties));
      }

      return spec.properties?.items || {};
    }
  },

  methods: {
    addAttribute() {
      this.dialogVisible = true;
      this.dialogModel = 'create';
    },

    edit(index) {
      this.dialogModel = 'edit';
      this.editRowIndex = index;
      this.dialogVisible = true;
    },

    deleteRow(index) {
      this.templateSpec.properties.splice(index, 1);
    },

    hideDialog() {
      this.dialogVisible = false;
    },

    addProperties(row) {
      this.templateSpec.properties.length = 0;
      this.templateSpec.properties.push(...row);
    },
  }
};
</script>

<template>
  <div>
    <div>
      <i class="el-icon-warning"></i>
      注意：设备属性会明文展示所输入信息，请不要填入敏感信息，如涉及敏感信息，请先加密，请防止信息泄露。
    </div>

    <AddTable
      :headers="currentHeader"
      :properties="templateSpec.properties"
      @editRow="edit($event)"
      @deleteRow="deleteRow($event)"
    />

    <div class="spacer"></div>

    <button class="btn btn-sm bg-primary" @click="addAttribute">
      新增属性
    </button>

    <template v-if="dialogVisible">
      <component
        :is="`${kind}Model`"
        v-if="isOfficialDevice"
        :template-spec="templateSpec"
        :edit-row-index="editRowIndex"
        :visible="dialogVisible"
        :dialog-model="dialogModel"
        @addProperties="addProperties($event)"
        @hideDialog="hideDialog($event)"
      />

      <CustomModel
        v-else
        :visible="dialogVisible"
        :template-spec="templateSpec"
        :template-properties="templateProperties"
        :edit-row-index="editRowIndex"
        :dialog-model="dialogModel"
        @addProperties="addProperties($event)"
        @hideDialog="hideDialog($event)"
      />
    </template>
  </div>
</template>
