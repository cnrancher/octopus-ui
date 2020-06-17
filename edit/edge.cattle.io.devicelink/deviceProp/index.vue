<script>
import _ from 'lodash';
import OpcUaModel from '@/edit/edge.cattle.io.devicelink/model/OpcUaModel';
import ModbusModel from '@/edit/edge.cattle.io.devicelink/model/ModbusModel';
import BluethoothModel from '@/edit/edge.cattle.io.devicelink/model/BluetoothModel';
import CustomModel from '@/edit/edge.cattle.io.devicelink/custom/CustomModel';
import AddTable from '@/edit/edge.cattle.io.devicelink/deviceProp/AddTable';
import {
  BluetoothDeviceHeader,
  ModbusDeviceHeader,
  OPCUADeviceHeader,
  CUSTOMDeviceHeader
} from '@/edit/edge.cattle.io.devicelink/type-header';
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
    BluethoothModel,
    ModbusModel,
    OpcUaModel,
    CustomModel
  },

  props: {
    value: {
      type:     Object,
      required: true,
    },
    mode: {
      type:     String,
    }
  },

  data() {
    const deviceProtocol = ['ModbusDevice', 'BluetoothDevice', 'OPCUADevice'];
    const kind = this.value.spec.model.kind;
    let isCustomProtocol = deviceProtocol.includes(kind);
    const { devicesType } = this.$store.state;
    const extension = this.value.spec.template.spec.extension;

    if (!extension) {
      this.$set(this.value.spec.template.spec, 'extension', _extension);
    }
    this.$set(this.value.spec.template.spec, 'extension', _.merge(_extension, extension));
    console.log('--------pazzzzzzz', this.value.spec.template.spec);

    const value = this.value.spec.model.kind;
    const resource = devicesType.filter((D) => {
      if (D.spec.names.kind === value) {
        return D;
      }
    });

    const spec = resource[0].spec.versions[0].schema.openAPIV3Schema.properties.spec.properties;
    if (!isCustomProtocol) {
      this.$set(this.value, 'spec', _.cloneDeep(customDevice));
    }
    console.log('----resource 自定义设备用到的spec----', spec, resource);
    const templateProperties = spec.properties?.items || [];

    return {
      headers: {
        BluetoothDeviceHeader,
        ModbusDeviceHeader,
        OPCUADeviceHeader
      },
      dialogVisible:      false,
      editRowIndex:       0,
      dialogModel:   'create',
      templateProperties,
      isCustomProtocol
    };
  },

  computed: {
    currentHeader() {
      const deviceProtocol = ['ModbusDevice', 'BluetoothDevice', 'OPCUADevice'];
      const kind = this.value.spec.model.kind;
      const isCustomProtocol = deviceProtocol.includes(kind);

      if (isCustomProtocol) {
        const headerName = `${ kind }Header`;

        return this.headers[headerName];
      }
      return CUSTOMDeviceHeader;
    },
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
      this.value.spec.template.spec.properties.splice(index, 1);
    },

    hideDialog() {
      this.dialogVisible = false;
    },

    addProperties(row) {
      this.value.spec.template.spec.properties.length = 0;
      this.value.spec.template.spec.properties.push(...row);
    },
  }
};
</script>

<template>
  <div>
    <div>
      <span>
        <i class="el-icon-warning"></i>
        注意：设备属性会明文展示所输入信息，请不要填入敏感信息，如涉及敏感信息，请先加密，请防止信息泄露。
      </span>
    </div>

    <AddTable
      :headers="currentHeader"
      :properties="value.spec.template.spec.properties"
      @editRow="edit($event)"
      @deleteRow="deleteRow($event)"
    />

    <div class="spacer"></div>
    <button
      class="btn btn-sm bg-primary"
      @click="addAttribute"
    >
      新增属性
    </button>

    <template v-if="dialogVisible">
      <BluethoothModel
        v-if="value.spec.model.kind === 'BluetoothDevice'"
        :value="value"
        :edit-row-index="editRowIndex"
        :visible="dialogVisible"
        :dialog-model="dialogModel"
        @addProperties="addProperties($event)"
        @hideDialog="hideDialog($event)"
      />

      <ModbusModel
        v-else-if="value.spec.model.kind === 'ModbusDevice'"
        :visible="dialogVisible"
        :edit-row-index="editRowIndex"
        :value="value"
        :dialog-model="dialogModel"
        @addProperties="addProperties($event)"
        @hideDialog="hideDialog($event)"
      />

      <OpcUaModel
        v-else-if="value.spec.model.kind === 'OPCUADevice'"
        :visible="dialogVisible"
        :edit-row-index="editRowIndex"
        :value="value"
        :dialog-model="dialogModel"
        @addProperties="addProperties($event)"
        @hideDialog="hideDialog($event)"
      />

      <CustomModel
        v-else
        :visible="dialogVisible"
        :template-properties="templateProperties"
        :edit-row-index="editRowIndex"
        :value="value"
        :dialog-model="dialogModel"
        @addProperties="addProperties($event)"
        @hideDialog="hideDialog($event)"
      />
    </template>
  </div>
</template>
