<script>
import Vue from 'vue';
import _ from 'lodash';
import LabeledInput from '@/components/form/LabeledInput';
import Checkbox from '@/components/form/Checkbox';
import LabeledSelect from '@/components/form/LabeledSelect';
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

  props: {
    templateSpec: {
      type:     Object,
      required: true,
    },
    namespace:  { type: String, required: true },
    references: { type: Array, required: true }
  },

  async fetch() {
    const hash = await allHash({ secret: this.$store.dispatch('cluster/findAll', { type: 'secret' }) });

    this.secret = hash.secret;
  },

  data() {
    const originExtension = _.cloneDeep(this.templateSpec.extension) || {};
    const _extension = _.merge(tempExtension, originExtension);

    const mqtt = _extension.mqtt;

    if (mqtt.message.will.content) {
      mqtt.message.will.content = atob(mqtt.message.will.content);
    }

    const isEnableBasicAuth = !!mqtt.client.basicAuth.name || false;
    let isEnableAdvanced = false;
    let isUsePrefixTopic = true;
    let isSetLastWillTopic = false;
    let isEnableServerName = false;

    if (mqtt.client.tlsConfig.serverName || mqtt.message.will.topic) {
      isEnableAdvanced = true;
    }

    if (mqtt.message.will.topic) {
      isSetLastWillTopic = true;
    }

    let topicPrefix = '';
    let topicName = '';

    const topic = mqtt.message.topic;

    if (topic) {
      if (topic.endsWith('/:namespace/:name')) {
        topicPrefix = topic.match(/(\S*)\/:namespace\/:name$/)[1];
        isUsePrefixTopic = true;
      } else if (topic.endsWith('/:name/:namespace')) {
        topicPrefix = topic.match(/(\S*)\/:name\/:namespace$/)[1];
        isUsePrefixTopic = true;
      } else if (topic.endsWith('/:uid')) {
        topicPrefix = topic.match(/(\S*)\/:uid$/)[1];
        isUsePrefixTopic = true;
      } else {
        isUsePrefixTopic = false;
        topicName = topic;
      }
    }

    if (mqtt.message.topic.name) {
      isUsePrefixTopic = false;
    } else if (mqtt.message.topic.prefix) {
      isUsePrefixTopic = true;
    }

    if (mqtt.client.tlsConfig.serverName) {
      isEnableServerName = true;
    }

    return {
      topicPrefix,
      topicName,
      isEnableBasicAuth,
      isUsePrefixTopic,
      isEnableAdvanced,
      isSetLastWillTopic,
      isEnableServerName,
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
        { label: '0 - AUTO', value: 0 },
        { label: '3 - MQTT 3.1', value: 3 },
        { label: '4 - MQTT 3.1.1', value: 4 },
      ];
    },
    qosList() {
      return [
        { label: '0 - Send at most once', value: 0 },
        { label: '1 - Send at least once', value: 1 },
        { label: '2 - Send exactly once', value: 2 },
      ];
    },
    booleanType() {
      return booleanType;
    },
    storeTypeList() {
      return [
        { label: 'Memory', value: 'Memory' },
        { label: 'File', value: 'File' },
      ];
    }
  },

  methods: {
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
      const Vadvance = this.validateAdvance();
      const Vauth = this.validateBasicAuth();
      const Vprefix = this.validatePrefix();
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
          Vue.delete(this.saveExtension.mqtt.client.basicAuth, 'username');
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
        if (!this.topicPrefix.trim()) {
          errors.push('请输入Prefix Name!');
        }
        const originTopic = this.topicPrefix;
        let topic = '';

        topic = `${ originTopic }/:namespace/:name`;
        this.saveExtension.mqtt.message.topic = topic;
      } else {
        if (!this.topicName.trim()) {
          errors.push('请输入Topic Name!');
        }
        this.saveExtension.mqtt.message.topic = this.topicName;
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
        Vue.delete(this.saveExtension.mqtt.message, 'will');
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

        if (this.saveExtension.mqtt.message?.will?.content) {
          this.saveExtension.mqtt.message.will.content = btoa(this.extension.mqtt.message.will.content);
        } else {
          Vue.delete(this.saveExtension.mqtt.message.will, 'content');
        }

        if (this.isSetLastWillTopic) { // delete will
          if (!this.saveExtension.mqtt.message?.will?.topic) {
            errors.push('请输入Topic Name!');
          }
        } else {
          Vue.delete(this.saveExtension.mqtt.message, 'will');
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

      <div class="col span-6">
        <LabeledSelect
          v-model.number="extension.mqtt.client.protocolVersion"
          label="protocolVersion"
          :options="versionList"
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
          v-model.trim="extension.mqtt.client.basicAuth.username"
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

    <div class="row">
      <div v-if="isUsePrefixTopic" class="col span-6">
        <LabeledInput
          v-model="topicPrefix"
          label="Prefix Name"
        />
      </div>

      <div v-if="!isUsePrefixTopic" class="col span-6">
        <LabeledInput
          v-model="topicName"
          label="Topic Name"
          required
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
          <Checkbox
            v-model="extension.mqtt.client.tlsConfig.insecureSkipVerify"
            class="checkbox"
            label="Skip Insecure Verify"
            type="checkbox"
          />
        </div>

        <div class="col span-6">
          <Checkbox
            v-model="isEnableServerName"
            class="checkbox"
            label="enable serverName"
            type="checkbox"
          />
        </div>
      </div>

      <div class="row">
        <div class="col span-3">
          <LabeledSelect
            v-model="extension.mqtt.client.tlsConfig.caFilePEMRef.name"
            label="CA File Pem (optional)"
            :options="secretList"
            @input="clearData('caFilePEMRef')"
          />
        </div>

        <div class="col span-3">
          <LabeledSelect
            v-model="extension.mqtt.client.tlsConfig.caFilePEMRef.item"
            label="data"
            :options="getSecretData(extension.mqtt.client.tlsConfig.caFilePEMRef.name)"
          />
        </div>

        <div v-if="isEnableServerName" class="col span-6">
          <LabeledInput
            v-model="extension.mqtt.client.tlsConfig.serverName"
            label="Server Name"
          />
        </div>
      </div>

      <div class="row">
        <div class="col span-6">
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
            @input="clearData('certFilePEMRef')"
          />
        </div>

        <div class="col span-3">
          <LabeledSelect
            v-model="extension.mqtt.client.tlsConfig.certFilePEMRef.item"
            label="data"
            :options="getSecretData(extension.mqtt.client.tlsConfig.certFilePEMRef.name)"
          />
        </div>

        <div class="col span-3">
          <LabeledSelect
            v-model="extension.mqtt.client.tlsConfig.keyFilePEMRef.name"
            label="Key File Pem"
            :options="secretList"
            @input="clearData('keyFilePEMRef')"
          />
        </div>

        <div class="col span-3">
          <LabeledSelect
            v-model="extension.mqtt.client.tlsConfig.keyFilePEMRef.item"
            label="data"
            :options="getSecretData(extension.mqtt.client.tlsConfig.keyFilePEMRef.name)"
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
              v-model="extension.mqtt.message.will.topic"
              label="Topic Name"
              placeholder="default $will"
            />
          </div>

          <div class="col span-6">
            <LabeledInput
              v-model="extension.mqtt.message.will.content"
              label="Content"
              required
              placeholder="请输入 Content"
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

        <div v-if="extension.mqtt.client.store.type === 'File'" class="col span-6">
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
