<script>
import Vue from 'vue';
import _ from 'lodash';
import LabeledInput from '@/components/form/LabeledInput';
import Checkbox from '@/components/form/Checkbox';
import LabeledSelect from '@/components/form/LabeledSelect';
import LoadDeps from '@/mixins/load-deps';
import { booleanType } from '@/config/map';
import { allHash } from '@/utils/promise';

export default {
  components: {
    LabeledInput,
    LabeledSelect,
    Checkbox
  },

  mixins:     [LoadDeps],

  props: {
    value: {
      type:     Object,
      required: true,
    },
  },

  data() {
    const mqtt = this.value.spec.template.spec.extension.mqtt;
    const isShowBasicAuth = !!mqtt.client.basicAuth.name || false;
    let isShowAdvanced = false;
    let isUsePrefixTopic = false;
    let isSetLastWillTopic = false;

    if (!mqtt.client.tlsConfig.insecureSkipVerify || mqtt.client.will.topicName) {
      isShowAdvanced = true;
    }

    if (mqtt.client.will.topicName) {
      isSetLastWillTopic = true
    }

    if (mqtt.message.topic.name) {
      isUsePrefixTopic = false;
    } else if (mqtt.message.topic.prefix) {
      isUsePrefixTopic = true;
    }

    return {
      isShowBasicAuth,
      isUsePrefixTopic,
      isShowAdvanced,
      isSetLastWillTopic,
      secret:             [],
    };
  },

  computed: {
    secretList() {
      const list = this.secret.filter( (S) => {
        return S.metadata.namespace === this.value.metadata.namespace;
      });
      const mapList = list.map( (S) => {
        return {
          label: S.metadata.name,
          value: S.metadata.name
        };
      });

      return mapList;
    },
    versionList() {
      return [
        { label: '3 - MQTT 3.1', value: 3 },
        { label: '4 - MQTT 3.1.1', value: 4 },
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
  },

  methods: {
    async loadDeps() {
      const hash = await allHash({ secret: this.$store.dispatch('cluster/findAll', { type: 'secret' }) });

      this.secret = hash.secret;
    },
    getSecretData(secretName) {
      const secret = this.secret.filter( (S) => {
        return S.metadata.name === secretName;
      });

      const data = secret.map( (D) => {
        return Object.keys(D.data).map( (K) => {
          return {
            label: K,
            value: K
          };
        });
      })

      return data[0] || []
    },
    deleteUnuseProp() {
      const {
        isShowBasicAuth, isUsePrefixTopic, isSetLastWillTopic
      } = this;
      const Vauth = this.validateBasicAuth();
      const Vprefix = this.validatePrefix();
      this.addReferences();

      console.log('-----Vauth', Vauth, Vprefix);

      return [...Vauth, ...Vprefix];
    },
    validateBasicAuth() {
      const errors = [];

      if (this.isShowBasicAuth) {
        const { name, passsword } = this.value.spec.template.spec.extension.mqtt.client.basicAuth;

        if (!name && !passsword) {
          Vue.delete(this.value.spec.template.spec.extension.mqtt.client.basicAuth, 'name');
          Vue.delete(this.value.spec.template.spec.extension.mqtt.client.basicAuth, 'passsword');
        } else if (!(name && passsword)) {
          errors.push('请输入name 或 password!');
        }
      } else {
        Vue.delete(this.value.spec.template.spec.extension.mqtt.client.basicAuth, 'name');
        Vue.delete(this.value.spec.template.spec.extension.mqtt.client.basicAuth, 'password');
      }

      return errors;
    },
    validatePrefix() {
      const errors = [];

      if (this.isUsePrefixTopic) {
        if (!this.value.spec.template.spec.extension.mqtt.message.topic.prefix.trim()) {
          errors.push('请输入Prefix Name!');
        }
        Vue.delete(this.value.spec.template.spec.extension.mqtt.message.topic, 'name');
      } else {
        if (!this.value.spec.template.spec.extension.mqtt.message.topic.name.trim()) {
          errors.push('请输入Topic Name!');
        }
        Vue.delete(this.value.spec.template.spec.extension.mqtt.message.topic, 'prefix');
        Vue.delete(this.value.spec.template.spec.extension.mqtt.message.topic, 'with');
      }

      return errors;
    },
    addReferences() {
      const { tlsConfig: { caFilePEMRef, certFilePEMRef, keyFilePEMRef } } = this.value.spec.template.spec.extension.mqtt.client;
      const arr = [caFilePEMRef, certFilePEMRef, keyFilePEMRef]
      const filterArr = _.uniqBy(arr, 'name');
      const references = filterArr.map( O => {
        return {
          name: O.name,
          secret: {
            name: O.name
          }
        }
      })
      this.$set(this.value.spec, 'references', references);
    },
    clearData(type) {
      this.value.spec.template.spec.extension.mqtt.client.tlsConfig[type].item = ''
    }
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          v-model.trim="value.spec.template.spec.extension.mqtt.client.server"
          label="MQTT Server"
          required
        />
      </div>

      <div class="col span-6">
        <LabeledSelect
          v-model.number="value.spec.template.spec.extension.mqtt.client.protocolVersion"
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
          v-model.trim="value.spec.template.spec.extension.mqtt.client.basicAuth.name"
          label="username"
          required
        />
      </div>

      <div class="col span-6">
        <LabeledInput
          v-model.trim="value.spec.template.spec.extension.mqtt.client.basicAuth.password"
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

    <div v-if="isUsePrefixTopic" class="row">
      <div class="col span-6">
        <LabeledInput
          v-model="value.spec.template.spec.extension.mqtt.message.topic.prefix"
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
          v-model.number="value.spec.template.spec.extension.mqtt.message.qos"
          label="QoS"
          :options="qosList"
        />
      </div>
    </div>

    <el-divider></el-divider>

    <div>
      <Checkbox
        v-model="isShowAdvanced"
        class="checkbox"
        label="Show Advanced Configuration"
        type="checkbox"
      />
    </div>

    <div v-if="isShowAdvanced" class="advanced">
      <div class="row">
        <div class="col span-6">
          <LabeledSelect
            v-model="value.spec.template.spec.extension.mqtt.client.tlsConfig.insecureSkipVerify"
            label="Skip Insecure Verify"
            :options="booleanType"
            required
          />
        </div>

        <div v-if="!value.spec.template.spec.extension.mqtt.client.tlsConfig.insecureSkipVerify" class="col span-6">
          <LabeledInput
            v-model="value.spec.template.spec.extension.mqtt.client.tlsConfig.serverName"
            label="Server Name"
          />
        </div>
      </div>

      <div v-if="!value.spec.template.spec.extension.mqtt.client.tlsConfig.insecureSkipVerify">
        <div class="row">
          <div class="col span-3">
            <LabeledSelect
              v-model="value.spec.template.spec.extension.mqtt.client.tlsConfig.certFilePEMRef.name"
              label="Cert File Pem"
              :options="this.secretList"
              @input="clearData('certFilePEMRef')"
              :clearable="true"
              required
            />
          </div>

          <div class="col span-3">
            <LabeledSelect
              v-model="value.spec.template.spec.extension.mqtt.client.tlsConfig.certFilePEMRef.item"
              label="data"
              :options="getSecretData(value.spec.template.spec.extension.mqtt.client.tlsConfig.certFilePEMRef.name)"
              required
            />
          </div>

          <div class="col span-3">
            <LabeledSelect
              v-model="value.spec.template.spec.extension.mqtt.client.tlsConfig.keyFilePEMRef.name"
              label="Key File Pem"
              :options="this.secretList"
              @input="clearData('keyFilePEMRef')"
              required
            />
          </div>

          <div class="col span-3">
            <LabeledSelect
              v-model="value.spec.template.spec.extension.mqtt.client.tlsConfig.keyFilePEMRef.item"
              label="data"
              :options="getSecretData(value.spec.template.spec.extension.mqtt.client.tlsConfig.keyFilePEMRef.name)"
              required
            />
          </div>
        </div>

        <div class="row">
          <div class="col span-3">
            <LabeledSelect
              v-model="value.spec.template.spec.extension.mqtt.client.tlsConfig.caFilePEMRef.name"
              label="CA File Pem (optional)"
              :options="this.secretList"
              @input="clearData('caFilePEMRef')"
            />
          </div>

          <div class="col span-3">
            <LabeledSelect
              v-model="value.spec.template.spec.extension.mqtt.client.tlsConfig.caFilePEMRef.item"
              label="data"
              :options="getSecretData(value.spec.template.spec.extension.mqtt.client.tlsConfig.caFilePEMRef.name)"
            />
          </div>

          <div class="col span-6">
            <nuxt-link
              to="/c/local/secret"
              tag="button"
              type="button"
              class="btn bg-primary ml-10"
            >
              添加secret
            </nuxt-link>
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
              placeholder="default $will"
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
              v-model.number="value.spec.template.spec.extension.mqtt.client.will.qos"
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
  </div>
</template>

<style lang="scss" scoped>
.largeHeight {
  height: 120px;
}
.advanced {
  margin-left: 30px;
}
</style>
