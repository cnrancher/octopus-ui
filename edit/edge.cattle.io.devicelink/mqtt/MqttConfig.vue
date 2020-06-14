<script>
import LabeledInput from '@/components/form/LabeledInput';
import ButtonGroup from '@/components/ButtonGroup';
import Checkbox from '@/components/form/Checkbox';
import LabeledSelect from '@/components/form/LabeledSelect';
import { booleanType } from '@/config/map';

export default {

  components: {
    LabeledInput,
    LabeledSelect,
    Checkbox
  },
  props: {
    value: {
      type:     Object,
      required: true,
    },
  },

  data() {
    return {
      isShowBasicAuth:    false,
      isUsePrefixTopic:   false,
      isSkipVerify:       true,
      isSetLastWillTopic: true,
    };
  },

  computed: {
    versionList() {
      return [
        { label: '3 - MQTT 3.1', value: '3' },
        { label: '4 - MQTT 3.1.1', value: '4' },
      ];
    },
    payloadEncodeList() {
      return [
        { label: 'raw', value: 'raw' },
        { label: 'base64', value: 'base64' },
      ];
    },
    qosList() {
      return [
        { label: '0 - Send at most once', value: 0 },
        { label: '1 - Send at least once', value: 1 },
        { label: '2 - Send exactly once', value: 2 },
      ];
    },
    topicWithList() {
      return [
        { label: 'nn - k8s name+namespace', value: 'nn' },
        { label: 'uid - k8s resource uid', value: 'uid' },
      ];
    },
    booleanType() {
      return booleanType;
    },
    storeTypeList() {
      return [
        { label: 'memory', value: 'memory' },
        { label: 'file', value: 'file' },
      ];
    }
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          v-model="value.spec.template.spec.extension.mqtt.client.server"
          label="MQTT Server"
          required
        />
      </div>

      <div class="col span-6">
        <LabeledSelect
          v-model="value.spec.template.spec.extension.mqtt.client.protocolVersion"
          label="protocolVersion"
          :options="versionList"
        />
      </div>
    </div>

    <div>
      <Checkbox
        v-model="isShowBasicAuth"
        class="checkbox"
        label="Enable basic auth"
        type="checkbox"
      />
    </div>

    <div v-if="isShowBasicAuth" class="row">
      <div class="col span-6">
        <LabeledInput
          v-model="value.spec.template.spec.extension.mqtt.client.basicAuth.name"
          label="username"
          required
        />
      </div>

      <div class="col span-6">
        <LabeledInput
          v-model="value.spec.template.spec.extension.mqtt.client.basicAuth.passsword"
          label="password"
          required
        />
      </div>
    </div>

    <el-divider></el-divider>

    <div>
      <Checkbox
        v-model="isUsePrefixTopic"
        class="checkbox"
        label="Use prefix topic"
        type="checkbox"
      />
    </div>

    <div v-if="isUsePrefixTopic">
      <div v-if="isUsePrefixTopic" class="row">
        <div class="col span-6">
          <LabeledInput
            v-model="value.spec.template.spec.extension.mqtt.message.topic.name"
            label="Prefix Name"
          />
        </div>

        <div class="col span-6">
          <LabeledSelect
            v-model="value.spec.template.spec.extension.mqtt.message.topic.with"
            label="Prefix mode"
            :options="topicWithList"
          />
        </div>
      </div>

      <div v-if="!isUsePrefixTopic" class="row">
        <div class="col span-6">
          <LabeledInput
            v-model="value.spec.template.spec.extension.mqtt.message.topic.name"
            label="Topic Name"
          />
        </div>
      </div>

      <div class="row">
        <div class="col span-6">
          <LabeledSelect
            v-model="value.spec.template.spec.extension.mqtt.message.payloadEncode"
            label="Payload Encode"
            :options="payloadEncodeList"
          />
        </div>

        <div class="col span-6">
          <LabeledSelect
            v-model="value.spec.template.spec.extension.mqtt.message.qos"
            label="QoS"
            :options="qosList"
          />
        </div>
      </div>
    </div>

    <el-divider></el-divider>

    <div>
      <Checkbox
        v-model="isSkipVerify"
        class="checkbox"
        label="Show Advanced Configuration"
        type="checkbox"
      />
    </div>

    <div v-if="isSkipVerify">
      <div class="row">
        <div class="col span-6">
          <LabeledSelect
            v-model="value.spec.template.spec.extension.mqtt.client.tlsConfig.insecureSkipVerify"
            label="Skip Insecure Verify"
            :options="booleanType"
            required
          />
        </div>
      </div>

      <div class="row">
        <div class="col span-6">
          <LabeledInput
            v-model="value.spec.template.spec.extension.mqtt.client.tlsConfig.certFilePem"
            label="Cert File Pem"
            placeholder="请输入Cert File Pem"
            class="largeHeight"
          />
        </div>

        <div class="col span-6">
          <LabeledInput
            v-model="value.spec.template.spec.extension.mqtt.client.tlsConfig.keyFilePem"
            label="Key File Pem"
            class="largeHeight"
            placeholder="请输入Key File Pem"
          />
        </div>
      </div>

      <div class="row">
        <div class="col span-6">
          <LabeledInput
            v-model="value.spec.template.spec.extension.mqtt.client.tlsConfig.caFilePem"
            label="CA File Pem (optional)"
            class="largeHeight"
            placeholder="请输入CA File Pem"
          />
        </div>
      </div>
    </div>

    <el-divider></el-divider>

    <div>
      <Checkbox
        v-model="isSetLastWillTopic"
        class="checkbox"
        label="Set Last Will Topic"
        type="checkbox"
      />
    </div>

    <div v-if="isSetLastWillTopic">
      <div class="row">
        <div class="col span-6">
          <LabeledInput
            v-model="value.spec.template.spec.extension.mqtt.client.will.topicName"
            label="Topic Name (optional)"
            placeholder="请输入topicName"
          />
        </div>

        <div class="col span-6">
          <LabeledInput
            v-model="value.spec.template.spec.extension.mqtt.client.will.payloadContent"
            label="Payload Content*"
            placeholder="请输入Payload Content"
          />
        </div>
      </div>

      <div class="row">
        <div class="col span-6">
          <LabeledSelect
            v-model="value.spec.template.spec.extension.mqtt.client.will.payloadEncode"
            label="Payload Encode"
            :options="payloadEncodeList"
          />
        </div>

        <div class="col span-6">
          <LabeledSelect
            v-model="value.spec.template.spec.extension.mqtt.client.will.qos"
            label="QoS"
            :options="qosList"
          />
        </div>
      </div>

      <div class="row">
        <div class="col span-6">
          <LabeledSelect
            v-model="value.spec.template.spec.extension.mqtt.client.will.retained"
            label="Retained"
            :options="booleanType"
            required
          />
        </div>
      </div>
    </div>

    <el-divider></el-divider>

    <div class="row">
      <div class="col span-6">
        <LabeledSelect
          v-model="value.spec.template.spec.extension.mqtt.client.store.type"
          label="Store Type"
          :options="storeTypeList"
          required
        />
      </div>

      <div v-if="value.spec.template.spec.extension.mqtt.client.store.type === 'file'" class="col span-6">
        <LabeledInput
          v-model="value.spec.template.spec.extension.mqtt.client.store.direcotryPrefix"
          label="Direcotry Prefix"
          required
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.largeHeight {
  height: 120px;
}
</style>
