<script>
import _ from 'lodash';
import KeyValue from '@/components/form/KeyValue';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import { accessModeList, operatorList } from '@/config/map';

const properties = {
  name:        '',
  description: '',
  accessMode:  'ReadOnly',
  visitor:     {
    characteristicUUID: '',
    defaultValue:       '',
    dataConverter:      {
      startIndex:        '',
      endIndex:          '',
      shiftRight:        '',
      orderOfOperations: []
    },
    dataWrite: {}
  }
};

export default {
  components: {
    KeyValue,
    LabeledInput,
    LabeledSelect
  },

  props: {
    templateSpec: {
      type:     Object,
      required: true
    },
    visible:      {
      type:    Boolean,
      default: false
    },
    editRowIndex: {
      type:     Number,
      required: true
    },
    dialogModel:  {
      type:     String,
      required: true
    }
  },

  data() {
    const localDevice = _.cloneDeep(this.templateSpec);
    let index = 0;

    if (this.dialogModel === 'create') {
      localDevice.properties.push(_.cloneDeep(properties));
      index = localDevice.properties.length - 1;
    } else {
      index = this.editRowIndex;
    }

    return {
      operatorList,
      accessModeList,
      localDevice,
      index
    };
  },

  computed: {
    accessMode() {
      const { index } = this;

      return this.localDevice.properties[index].accessMode;
    }
  },

  methods: {
    add(formName) {
      const properties = this.localDevice.properties;

      this.$emit('addProperties', _.cloneDeep(properties));
      this.$emit('hideDialog', false);
    },
    hide() {
      this.$emit('hideDialog', false);
    },
    changedRef(row, val, which) {
      delete row.operationRef;
      delete row.operationType;
      delete row.key;
      delete row.binary;
    },
  }
};
</script>
<template>
  <el-dialog
    v-if="localDevice"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="1000px"
    :before-close="hide"
  >
    <header slot="title">
      <span class="icon"></span>添加新属性
    </header>

    <div class="row">
      <div class="col span-6">
        <LabeledInput
          key="attname"
          v-model="localDevice.properties[index].name"
          label="属性名"
          mode="create"
        />
      </div>

      <div class="col span-6">
        <LabeledInput
          key="desc"
          v-model="localDevice.properties[index].description"
          label="描述"
          mode="create"
        />
      </div>
    </div>

    <div class="row">
      <div class="col span-6">
        <LabeledSelect
          key="accessMode"
          v-model="localDevice.properties[index].accessMode"
          label="accessMode"
          :options="accessModeList"
        />
      </div>

      <div class="col span-6">
        <LabeledInput
          key="UUID"
          v-model="localDevice.properties[index].visitor.characteristicUUID"
          label="UUID"
          mode="create"
        />
      </div>
    </div>

    <template v-if="accessMode === 'ReadOnly' || accessMode === 'ReadWrite'">
      <div class="row">
        <div class="col span-6">
          <LabeledInput
            v-model.number="localDevice.properties[index].visitor.dataConverter.startIndex"
            label="startIndex"
          />
        </div>

        <div class="col span-6">
          <LabeledInput
            v-model="localDevice.properties[index].visitor.dataConverter.endIndex"
            label="endIndex"
          />
        </div>
      </div>

      <div class="row">
        <div class="col span-6">
          <LabeledInput
            v-model="localDevice.properties[index].visitor.dataConverter.shiftRight"
            label="shiftRight"
          />
        </div>
      </div>
    </template>

    <template v-if="accessMode !== 'NotifyOnly'">
      <div class="row">
        <KeyValue
          key="operationType"
          v-model="localDevice.properties[index].visitor.dataConverter.orderOfOperations"
          key-name="operationType"
          value-name="operationValue"
          :pad-left="false"
          :as-map="false"
          :read-allowed="false"
          :protip="false"
        >
          <template #key="{row}">
            <span>
              <select
                ref="operation"
                v-model="row.operationType"
                class="bigInput"
                @input="changedRef(row, $event.target.value, 'operation')"
              >
                <option v-for="opt in operatorList" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </span>
          </template>
        </KeyValue>
      </div>
    </template>

    <template v-if="accessMode === 'ReadWrite'">
      <div class="row">
        <div class="col span-6">
          <LabeledInput
            v-model="localDevice.properties[index].visitor.defaultValue"
            label="defaultValue"
          />
        </div>
      </div>

      <div class="row">
        <KeyValue
          key="labels"
          v-model="localDevice.properties[index].visitor.dataWrite"
          :value-multiline="false"
          :pad-left="false"
          :as-map="true"
          :read-allowed="false"
          add-label="Add DataWrite"
          :protip="false"
        />
      </div>
    </template>

    <span slot="footer" class="dialog-footer">
      <el-button @click="hide">取 消</el-button>
      <el-button type="primary" @click="add">确 定</el-button>
    </span>
  </el-dialog>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  font-size: 16px;
  line-height: 36px;
  font-weight: bold;
  color: #363636;

  .icon {
    margin-right: 6px;
    width: 3px;
    height: 18px;
    background-image: linear-gradient(#030b56, #1144d4);
  }
}
.bigInput {
  height: 50px;
}
</style>
