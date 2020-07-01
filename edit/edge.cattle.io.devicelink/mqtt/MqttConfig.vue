<script>
import Vue from 'vue';
import _ from 'lodash';
import LabeledInput from '@/components/form/LabeledInput';
import Checkbox from '@/components/form/Checkbox';
import LabeledSelect from '@/components/form/LabeledSelect';
import LoadDeps from '@/mixins/load-deps';
import { booleanType } from '@/config/map';
import { allHash } from '@/utils/promise';
import { customDevice, extension } from '@/edit/edge.cattle.io.devicelink/defaultYaml';

const tempExtension = _.cloneDeep(extension);

export default {
  components: {
    LabeledInput,
    LabeledSelect,
    Checkbox
  },

  mixins: [LoadDeps],

  props: {
    templateSpec: {
      type:     Object,
      required: true,
    },
    namespace:  { type: String, required: true },
    references: { type: Array, required: true }
  },

  data() {
    const originExtension = _.cloneDeep(this.templateSpec.extension) || {};
    const _extension = _.merge(tempExtension, originExtension);

    const mqtt = _extension.mqtt;
    const isEnableBasicAuth = !!mqtt.client.basicAuth.name || false;
    let isEnableAdvanced = false;
    let isUsePrefixTopic = true;
    let isSetLastWillTopic = false;

    if (mqtt.client.tlsConfig.serverName || mqtt.client.will.topicName) {
      isEnableAdvanced = true;
    }

    if (mqtt.client.will.topicName) {
      isSetLastWillTopic = true;
    }

    if (mqtt.message.topic.name) {
      isUsePrefixTopic = false;
    } else if (mqtt.message.topic.prefix) {
      isUsePrefixTopic = true;
    }

    return {
      isEnableBasicAuth,
      isUsePrefixTopic,
      isEnableAdvanced,
      isSetLastWillTopic,
      secret:        [],
      extension:     _extension,
      saveExtension: {}
    };
  },

  computed: {
    secretList() {
      const list = this.secret.filter( (S) => {
        return S.metadata.namespace === this.namespace;
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
      });

      return data[0] || [];
    },
    deleteUnuseProp() {
      this.$set(this, 'saveExtension', _.cloneDeep(this.extension));
      this.addReferences();

      if (!this.saveExtension.mqtt.client.server) {
        this.$emit('update:extension', 'empty');

        return [];
      }

      const { isEnableBasicAuth, isUsePrefixTopic, isSetLastWillTopic } = this;
      const Vauth = this.validateBasicAuth();
      const Vprefix = this.validatePrefix();
      const Vadvance = this.validateAdvance();
      const error = [...Vauth, ...Vprefix, ...Vadvance];

      if (error.length) {
        return error;
      } else {
        this.$emit('update:extension', this.saveExtension);

        return [];
      }
    },
    validateBasicAuth() {
      const errors = [];

      if (this.isEnableBasicAuth) {
        const { name, passsword } = this.saveExtension.mqtt.client.basicAuth;

        if (!name && !passsword) {
          Vue.delete(this.saveExtension.mqtt.client.basicAuth, 'name');
          Vue.delete(this.saveExtension.mqtt.client.basicAuth, 'passsword');
        } else if (!(name && passsword)) {
          errors.push('请输入name 或 password!');
        }
      } else {
        Vue.delete(this.saveExtension.mqtt.client, 'basicAuth');
      }

      return errors;
    },
    validatePrefix() {
      const errors = [];

      if (this.isUsePrefixTopic) {
        if (!this.saveExtension.mqtt.message.topic.prefix.trim()) {
          errors.push('请输入Prefix Name!');
        }
        Vue.delete(this.saveExtension.mqtt.message.topic, 'name');
      } else {
        if (!this.saveExtension.mqtt.message.topic.name.trim()) {
          errors.push('请输入Topic Name!');
        }
        Vue.delete(this.saveExtension.mqtt.message.topic, 'prefix');
        Vue.delete(this.saveExtension.mqtt.message.topic, 'with');
      }

      return errors;
    },
    addReferences() {
      const { tlsConfig: { caFilePEMRef, certFilePEMRef, keyFilePEMRef } } = this.saveExtension.mqtt.client;
      const arr = [caFilePEMRef, certFilePEMRef, keyFilePEMRef];

      const filterArr = _.uniqBy(arr.filter( (O) => {
        return O.name !== '' && O.item !== '';
      }), 'name');

      const references = filterArr.map( (O) => {
        return {
          name:   O.name,
          secret: { name: O.name }
        };
      });

      this.$emit('update:references', _.cloneDeep(references));
    },
    validateAdvance() {
      const errors = [];

      if (!this.isEnableAdvanced) {
        Vue.delete(this.saveExtension.mqtt.client, 'tlsConfig');
        Vue.delete(this.saveExtension.mqtt.client, 'will');
        Vue.delete(this.saveExtension.mqtt.client, 'store');
      } else {
        if (this.saveExtension.mqtt.client.tlsConfig.serverName) { // delete tlsconfig
          const { tlsConfig: { caFilePEMRef, certFilePEMRef, keyFilePEMRef } } = this.saveExtension.mqtt.client;

          if (certFilePEMRef.name === '' || certFilePEMRef.item === '') {
            Vue.delete(this.saveExtension.mqtt.client.tlsConfig, 'certFilePEMRef');
          }

          if (caFilePEMRef.name === '' || caFilePEMRef.item === '') {
            Vue.delete(this.saveExtension.mqtt.client.tlsConfig, 'caFilePEMRef');
          }

          if (this.saveExtension.mqtt.client.tlsConfig.insecureSkipVerify) {
            Vue.delete(this.saveExtension.mqtt.client.tlsConfig, 'caFilePEMRef');
          } else if (caFilePEMRef.name === '' || caFilePEMRef.item === '') {
            Vue.delete(this.saveExtension.mqtt.client.tlsConfig, 'caFilePEMRef');
          }
        } else {
          Vue.delete(this.saveExtension.mqtt.client, 'tlsConfig');
        }

        if (this.isSetLastWillTopic) { // delete will
          if (!this.saveExtension.mqtt.client.will.topicName) {
            errors.push('请输入Topic Name!');
          }
          if (!this.saveExtension.mqtt.client.will.payloadContent) {
            errors.push('请输入Payload Content!');
          }
        } else {
          Vue.delete(this.saveExtension.mqtt.client, 'will');
        }
      }

      return errors;
    },
    clearData(type) {
      this.extension.mqtt.client.tlsConfig[type].item = '';
    }
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          v-model.trim="extension.mqtt.client.server"
          required
          label="MQTT Server"
        />
      </div>
    </div>

    <div>
      <Checkbox
        v-model="isEnableBasicAuth"
        type="checkbox"
        class="checkbox"
        label="Enable basic auth"
      />
    </div>

    <div v-if="isEnableBasicAuth" class="row">
      <div class="col span-6">
        <LabeledInput
          v-model.trim="extension.mqtt.client.basicAuth.name"
          label="username"
          required
        />
      </div>

      <div class="col span-6">
        <LabeledInput
          v-model.trim="extension.mqtt.client.basicAuth.password"
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
          v-model="extension.mqtt.message.topic.prefix"
          label="Prefix Name"
        />
      </div>

      <div class="col span-6">
        <LabeledSelect
          v-model="extension.mqtt.message.topic.with"
          label="Prefix mode"
          :options="topicWithList"
        />
      </div>
    </div>

    <div v-if="!isUsePrefixTopic" class="row">
      <div class="col span-6">
        <LabeledInput
          v-model="extension.mqtt.message.topic.name"
          label="Topic Name"
        />
      </div>
    </div>

    <div class="row">
      <div class="col span-6">
        <LabeledSelect
          v-model="extension.mqtt.message.payloadEncode"
          label="Payload Encode"
          :options="payloadEncodeList"
        />
      </div>

      <div class="col span-6">
        <LabeledSelect
          v-model.number="extension.mqtt.message.qos"
          label="QoS"
          :options="qosList"
        />
      </div>
    </div>

    <el-divider></el-divider>

    <div>
      <Checkbox
        v-model="isEnableAdvanced"
        class="checkbox"
        label="Enable Advanced Configuration"
        type="checkbox"
      />
    </div>

    <div v-if="isEnableAdvanced" class="advanced">
      <div class="row">
        <div class="col span-6">
          <LabeledInput
            v-model="extension.mqtt.client.tlsConfig.serverName"
            label="Server Name"
          />
          <nuxt-link
            to="/c/local/secret"
            class="add mt-10"
          >
            点击跳转添加密文
          </nuxt-link>
        </div>
      </div>

      <div class="row">
        <div class="col span-3">
          <LabeledSelect
            v-model="extension.mqtt.client.tlsConfig.certFilePEMRef.name"
            label="Cert File Pem"
            :options="secretList"
            :clearable="true"
            required
            @input="clearData('certFilePEMRef')"
          />
        </div>

        <div class="col span-3">
          <LabeledSelect
            v-model="extension.mqtt.client.tlsConfig.certFilePEMRef.item"
            label="data"
            :options="getSecretData(extension.mqtt.client.tlsConfig.certFilePEMRef.name)"
            required
          />
        </div>

        <div class="col span-3">
          <LabeledSelect
            v-model="extension.mqtt.client.tlsConfig.keyFilePEMRef.name"
            label="Key File Pem"
            :options="secretList"
            required
            @input="clearData('keyFilePEMRef')"
          />
        </div>

        <div class="col span-3">
          <LabeledSelect
            v-model="extension.mqtt.client.tlsConfig.keyFilePEMRef.item"
            label="data"
            :options="getSecretData(extension.mqtt.client.tlsConfig.keyFilePEMRef.name)"
            required
          />
        </div>
      </div>

      <div>
        <Checkbox
          v-model="extension.mqtt.client.tlsConfig.insecureSkipVerify"
          class="checkbox"
          label="Skip Insecure Verify"
          type="checkbox"
        />
      </div>

      <div class="row">
        <div v-if="extension.mqtt.client.tlsConfig.insecureSkipVerify" class="col span-3">
          <LabeledSelect
            v-model="extension.mqtt.client.tlsConfig.caFilePEMRef.name"
            label="CA File Pem (optional)"
            :options="secretList"
            @input="clearData('caFilePEMRef')"
          />
        </div>

        <div v-if="extension.mqtt.client.tlsConfig.insecureSkipVerify" class="col span-3">
          <LabeledSelect
            v-model="extension.mqtt.client.tlsConfig.caFilePEMRef.item"
            label="data"
            :options="getSecretData(extension.mqtt.client.tlsConfig.caFilePEMRef.name)"
          />
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
              v-model="extension.mqtt.client.will.topicName"
              label="Topic Name (optional)"
              placeholder="default $will"
            />
          </div>

          <div class="col span-6">
            <LabeledInput
              v-model="extension.mqtt.client.will.payloadContent"
              label="Payload Content*"
              placeholder="请输入Payload Content"
            />
          </div>
        </div>

        <div class="row">
          <div class="col span-6">
            <LabeledSelect
              v-model="extension.mqtt.client.will.payloadEncode"
              label="Payload Encode"
              :options="payloadEncodeList"
            />
          </div>

          <div class="col span-6">
            <LabeledSelect
              v-model.number="extension.mqtt.client.will.qos"
              label="QoS"
              :options="qosList"
            />
          </div>
        </div>

        <div class="row">
          <div class="col span-6">
            <LabeledSelect
              v-model="extension.mqtt.client.will.retained"
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
            v-model="extension.mqtt.client.store.type"
            label="Store Type"
            :options="storeTypeList"
            required
          />
        </div>

        <div v-if="extension.mqtt.client.store.type === 'file'" class="col span-6">
          <LabeledInput
            v-model="extension.mqtt.client.store.direcotryPrefix"
            label="Direcotry Prefix"
            required
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.advanced {
  margin-left: 30px;
}
.add {
  display: inline-block;
}
</style>
