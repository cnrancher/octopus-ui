<script>
import LabeledSelect from '@/components/form/LabeledSelect';
import LabeledInput from '@/components/form/LabeledInput';
import { allHash } from '@/utils/promise';

export default {
  components: { LabeledInput, LabeledSelect },

  props: {
    templateSpec: {
      type:     Object,
      required: true,
    },
    namespace:  { type: String, required: true },
  },

  async fetch() {
    const hash = await allHash({ secret: this.$store.dispatch('cluster/findAll', { type: 'secret' }) });

    this.secret = hash.secret;
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

  methods: {
    clearData(type) {
      this.templateSpec.protocol.tlsConfig[type].item = '';
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
  },

  data() {
    return { 
      secret: [],
    }
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          v-model="templateSpec.protocol.endpoint"
          label="endpoint"
        />
      </div>

      <div class="col span-6">
        <LabeledInput
          v-model="templateSpec.protocol.basicAuth.username"
          label="username"
        />
      </div>
    </div>

    <div class="row">
      <div class="col span-6">
        <LabeledInput
          v-model="templateSpec.protocol.basicAuth.password"
          label="password"
        />
      </div>
    </div>

    <div class="row">
      <div class="col span-3">
        <LabeledSelect
          v-model="templateSpec.protocol.tlsConfig.certFilePEMRef.name"
          label="Cert File Pem"
          :options="secretList"
          :clearable="true"
          @input="clearData('certFilePEMRef')"
        />
      </div>

      <div class="col span-3">
        <LabeledSelect
          v-model="templateSpec.protocol.tlsConfig.certFilePEMRef.item"
          label="data"
          :options="getSecretData(templateSpec.protocol.tlsConfig.certFilePEMRef.name)"
        />
      </div>

      <div class="col span-3">
        <LabeledSelect
          v-model="templateSpec.protocol.tlsConfig.keyFilePEMRef.name"
          label="Key File Pem"
          :options="secretList"
          @input="clearData('keyFilePEMRef')"
        />
      </div>

      <div class="col span-3">
        <LabeledSelect
          v-model="templateSpec.protocol.tlsConfig.keyFilePEMRef.item"
          label="data"
          :options="getSecretData(templateSpec.protocol.tlsConfig.keyFilePEMRef.name)"
        />
      </div>
    </div>
  </div>
</template>
