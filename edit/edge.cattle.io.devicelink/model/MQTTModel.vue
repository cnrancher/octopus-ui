<script>
import _ from 'lodash';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import Checkbox from '@/components/form/Checkbox';
import { accessModeList, operatorList } from '@/config/map';

const properties = {
  name:        '',
  path:        '',
  description: '',
  operator:    {
    read:  '',
    write: ''
  },
  readOnly: true,
  type:     'string',
  value:    null,
};

export default {
  components: {
    LabeledInput,
    LabeledSelect,
    Checkbox
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
      mqttMode:   this.templateSpec.protocol.pattern,
      subMessage: '',
      pubMessage: '',
      canWrite:   !localDevice.properties[index].readOnly,
      protocol:   this.templateSpec.protocol,
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
    },
    typeList() {
      return [{
        label: 'int',
        value: 'int'
      }, {
        label: 'string',
        value: 'string'
      }, {
        label: 'float',
        value: 'float'
      }, {
        label: 'boolean',
        value: 'boolean'
      }, {
        label: 'object',
        value: 'object'
      }, {
        label: 'array',
        value: 'array'
      }];
    },
  },

  watch: {
    localDevice: {
      handler(neu) {
        this.subMessage = this.sub();
        this.pubMessage = this.pub();
      },
      deep:      true,
      immediate: true
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
    updateName(neu) {
      this.localDevice.properties[this.index].path = neu;
    },
    sub() {
      let sub = this.protocol.message.topic;
      const read = this.localDevice.properties[this.index].operator.read || this.protocol.operator.read;

      sub = sub.replace(':path', this.localDevice.properties[this.index].path);
      sub = sub.replace(':operator', read);

      return sub;
    },
    pub() {
      let pub = this.protocol.message.topic;
      const write = this.localDevice.properties[this.index].operator.write || this.protocol.operator.write;

      pub = pub.replace(':path', this.localDevice.properties[this.index].path);
      pub = pub.replace(':operator', write);

      return pub;
    },
    update() {
      this.localDevice.properties[this.index].readOnly = !this.canWrite;
    },
    updateType() {
      this.localDevice.properties[this.index].value = null;
    }
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

    <div @input="update">
      <div class="row">
        <div class="col span-6">
          <LabeledInput
            key="attname"
            v-model="localDevice.properties[index].name"
            label="属性名"
            mode="create"
            required
            @input="updateName"
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
        <div class="col span-5">
          <LabeledSelect
            key="type"
            v-model="localDevice.properties[index].type"
            label="类型"
            :options="typeList"
            @input="updateType"
          />
        </div>

        <div class="col span-1">
          <Checkbox
            v-model="canWrite"
            class="checkbox"
            label="可写"
            type="checkbox"
          />
        </div>

        <div v-if="canWrite" class="col span-6">
          <LabeledInput
            v-if="localDevice.properties[index].type === 'int' || localDevice.properties[index].type === 'float'"
            key="value"
            v-model.number="localDevice.properties[index].value"
            label="值"
          />

          <LabeledSelect
            v-else-if="localDevice.properties[index].type === 'boolean'"
            v-model="localDevice.properties[index].value"
            label="值"
            :options="[{label: 'True', value: false}, {label: 'False', value: true}]"
          />

          <LabeledInput
            v-else
            key="value"
            v-model="localDevice.properties[index].value"
            label="值"
          />
        </div>
      </div>

      <div class="row">
        <div class="span-6">
          <LabeledInput
            key="path"
            v-model="localDevice.properties[index].path"
            label="路径"
          />
        </div>
      </div>

      <div v-if="protocol.pattern === 'AttributedTopic'" class="row">
        <div class="col span-6">
          <LabeledInput
            v-model="localDevice.properties[index].operator.read"
            label="读路径(订阅)"
          />
        </div>

        <div v-if="canWrite" class="col span-6">
          <LabeledInput
            v-model="localDevice.properties[index].operator.write"
            label="写路径(推送)"
          />
        </div>
      </div>

      <div class="mb-20">
        <h4 class="mb-10">
          {{ `订阅：${subMessage}` }}
        </h4>
        <h4 v-if="canWrite">
          {{ `发布：${pubMessage}` }}
        </h4>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="hide">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </div>
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
</style>
