<script>
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
    templateProperties: {
      type:    Object,
      default: () => {}
    },
  },

  data() {
    return {
      headers: {
        BluetoothDeviceHeader,
        ModbusDeviceHeader,
        OPCUADeviceHeader
      },
      dialogVisible:      false,
      editRowIndex:       0,
      dialogModel:   'create'
    };
  },

  computed: {
    isCustomProtocol() {
      const deviceProtocol = ['ModbusDevice', 'BluetoothDevice', 'OPCUADevice'];
      const kind = this.value.spec.model.kind;

      return deviceProtocol.includes(kind);
    },
    currentHeader() {
      const kind = this.value.spec.model.kind;

      if (this.isCustomProtocol) {
        const headerName = `${ kind }Header`;

        return this.headers[headerName];
      } else {
        return CUSTOMDeviceHeader;
      }
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
        :device="value"
        @addProperties="addProperties($event)"
        @hideDialog="hideDialog($event)"
      />
    </template>
  </div>
</template>
