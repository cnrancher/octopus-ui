<script>
import _ from 'lodash';
import LabeledSelect from '@/components/form/LabeledSelect';
import LabeledInput from '@/components/form/LabeledInput';
import { allHash } from '@/utils/promise';
import { extension } from '@/edit/edge.cattle.io.devicelink/defaultYaml';

const _templateSpec = {
  extension,
  parameters: {
    syncInterval: '15s',
    timeout:      '10s'
  },
  protocol: {
    basicAuth: {
      username: '',
      password:   '',
    },
    tlsConfig: {
      certFilePEMRef: {
        name: '',
        item: ''
      },
      keyFilePEMRef: {
        name: '',
        item: ''
      }
    }
  },
  properties: []
};

export default {
  components: { LabeledInput, LabeledSelect },

  props: {
    templateSpec: {
      type:     Object,
      required: true,
    },
    namespace: {
      type:    String,
      default: 'default'
    },
  },

  async fetch() {
    const hash = await allHash({ secret: this.$store.dispatch('cluster/findAll', { type: 'secret' }) });

    this.secret = hash.secret;
  },

  data() {
    const value = _.cloneDeep(this.templateSpec);

    return {
      value,
      secret: []
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
  },

  watch: {
    templateSpec() {
      Object.assign(this.value, _.merge(_.cloneDeep(this.templateSpec), _.cloneDeep(_templateSpec)));
    }
  },

  methods: {
    clearData(type) {
      this.templateSpec.protocol.tlsConfig[type].item = '';
    },
    getReferences() {
      const { tlsConfig: { certFilePEMRef, keyFilePEMRef } } = this.value.protocol;
      const arr = [certFilePEMRef, keyFilePEMRef];

      const filterArr = _.uniqBy(arr.filter( (O) => {
        return O.name !== '' && O.item !== '';
      }), 'name');

      const references = filterArr.map( (O) => {
        return {
          name:   O.name,
          secret: { name: O.name }
        };
      });

      return references;
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
      const references = this.getReferences();
      const _cloneValue = _.cloneDeep(this.value);

      if (!_cloneValue.protocol.basicAuth.password && !_cloneValue.protocol.basicAuth.password) {
        delete _cloneValue.protocol.basicAuth;
      }

      const tls = _cloneValue.protocol.tlsConfig;

      if ((!tls.certFilePEMRef.item || !tls.certFilePEMRef.name) || (!tls.keyFilePEMRef.item || !tls.keyFilePEMRef.name)) {
        delete _cloneValue.protocol.tlsConfig;
      }

      this.$emit('update:opcConfig', _cloneValue.protocol, references);
    }
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          v-model="value.protocol.endpoint"
          label="endpoint"
        />
      </div>
    </div>

    <el-divider>高级配置</el-divider>

    <div class="row">
      <div class="col span-6">
        <LabeledInput
          v-model="value.protocol.basicAuth.username"
          label="username"
        />
      </div>

      <div class="col span-6">
        <LabeledInput
          v-model="value.protocol.basicAuth.password"
          label="password"
        />
      </div>
    </div>

    <div class="row">
      <div class="col span-3">
        <LabeledSelect
          v-model="value.protocol.tlsConfig.certFilePEMRef.name"
          label="Cert File Pem"
          :options="secretList"
          :clearable="true"
          @input="clearData('certFilePEMRef')"
        />
      </div>

      <div class="col span-3">
        <LabeledSelect
          v-model="value.protocol.tlsConfig.certFilePEMRef.item"
          label="data"
          :options="getSecretData(value.protocol.tlsConfig.certFilePEMRef.name)"
        />
      </div>

      <div class="col span-3">
        <LabeledSelect
          v-model="value.protocol.tlsConfig.keyFilePEMRef.name"
          label="Key File Pem"
          :options="secretList"
          @input="clearData('keyFilePEMRef')"
        />
      </div>

      <div class="col span-3">
        <LabeledSelect
          v-model="value.protocol.tlsConfig.keyFilePEMRef.item"
          label="data"
          :options="getSecretData(value.protocol.tlsConfig.keyFilePEMRef.name)"
        />
      </div>
    </div>
  </div>
</template>
