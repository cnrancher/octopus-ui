<script>
/* eslint-disable */
import _ from 'lodash';
import jsyaml from 'js-yaml';
import NameNsDescription from '@/components/form/NameNsDescription';
import Footer from '@/components/form/Footer';
import LabeledSelect from '@/components/form/LabeledSelect';
import CreateEditView from '@/mixins/create-edit-view';
import CatalogHeader from '@/components/AppHeader';
import Collapse from '@/components/Collapse';
import CodeMirror from '@/components/CodeMirror';
import { _EDIT, _CREATE, _VIEW } from '@/config/query-params';
import { allHash } from '@/utils/promise';
import LoadDeps from '@/mixins/load-deps';
import { CATALOG, HELM, NAMESPACE } from '@/config/types';

const _tempValue = {
  metadata:   {
    annotations: {
      'edgeapi.cattle.io/edge-api-server': 'true',
      'edgeapi.cattle.io/owner-name':      'admin'
    },
    name: '',
  },
  spec: {
    chart:           '',
    repo:            'http://charts.cnrancher.cn',
    version:         '',
    targetNamespace: 'default',
    valuesContent:   'replicaCount: 3\nimage:\n  pullPolicy: IfNotPresent\n  repository: emqx/emqx\nresources:\n  limits:\n    cpu: 500m\n    memory: 512Mi\n  requests:\n    cpu: 500m\n    memory: 512Mi\npersistence:\n  accessMode: ReadWriteOnce\n  enabled: false\n  size: 20Mi\nservice.type: ClusterIP\nemqxConfig:\n  EMQX_CLUSTER__K8S__ADDRESS_TYPE: hostname\n  EMQX_CLUSTER__K8S__APISERVER: https://kubernetes.default.svc:443\n  EMQX_CLUSTER__K8S__SUFFIX: svc.cluster.local\nemqxLicneseSecretName: null\ntolerations: []\nnodeSelector: {}\naffinity: {}\ningress:\n  annotations: {}\n  enabled: false\n  hosts:\n  - chart-example.local\n  path: /\n  tls: []'
  }
};

export default {
  name: 'EditHelmChart',

  components: {
    Footer,
    NameNsDescription,
    LabeledSelect,
    Collapse,
    CodeMirror,
    CatalogHeader
  },

  mixins: [CreateEditView, LoadDeps],

  props: {
    value: {
      type:     Object,
      required: true,
    },
  },

  data() {
    const {
      id, app, name, namespace
    } = this.$route.query;
    let currentValue = '';

    if (this.mode === _CREATE) {
      console.log('----创建');
      const cloneValue = _.cloneDeep(_tempValue);
      if (app === 'emqx') {
        cloneValue.spec.valuesContent = 'replicaCount: 3\nimage:\n  pullPolicy: IfNotPresent\n  repository: emqx/emqx\nresources:\n  limits:\n    cpu: 500m\n    memory: 512Mi\n  requests:\n    cpu: 500m\n    memory: 512Mi\npersistence:\n  accessMode: ReadWriteOnce\n  enabled: false\n  size: 20Mi\nservice.type: ClusterIP\nemqxConfig:\n  EMQX_CLUSTER__K8S__ADDRESS_TYPE: hostname\n  EMQX_CLUSTER__K8S__APISERVER: https://kubernetes.default.svc:443\n  EMQX_CLUSTER__K8S__SUFFIX: svc.cluster.local\nemqxLicneseSecretName: null\ntolerations: []\nnodeSelector: {}\naffinity: {}\ningress:\n  annotations: {}\n  enabled: false\n  hosts:\n  - chart-example.local\n  path: /\n  tls: []'
      }
      cloneValue.metadata.annotations['edgeapi.cattle.io/catalogs'] = name;
      this.$set(this.value, 'metadata', _.merge(cloneValue.metadata, this.value.metadata));
      this.$set(this.value, 'spec', _.merge(cloneValue.spec, this.value.spec));
      this.$set(this.value.spec, 'chart', app);
    }
    currentValue = jsyaml.safeDump(this.value.spec.valuesContent);
    console.log('111----app', app, this.value.spec.chart)
    return {
      app:      app || this.value.spec.chart,
      currentValue,
      catalogs: {}
    };
  },

  computed: {
    isEdit() {
      return this.mode === _EDIT;
    },
    icon() {
      return this.catalogs?.[this.app]?.[0].icon;
    },
    description() {
      return this.catalogs?.[this.app]?.[0].description;
    },
    versions() {
      const arr = this.catalogs?.[this.app] || [];
      const versions = arr.map( (V) => {
        return V.version;
      });

      return versions.sort((a, b) => {
        return (b).localeCompare(a);
      });
    },
    cmOptions() {
      const readOnly = false;
      const gutters = ['CodeMirror-lint-markers'];

      if ( !readOnly ) {
        gutters.push('CodeMirror-foldgutter');
      }

      return {
        readOnly,
        gutters,
        mode:            'yaml',
        lint:            true,
        lineNumbers:     !readOnly,
        extraKeys:       { 'Ctrl-Space': 'autocomplete' },
        cursorBlinkRate: ( readOnly ? -1 : 530 )
      };
    },
  },

  methods: {
    enable(buttonCb) {
      const currentValue = jsyaml.safeLoad(this.currentValue);

      this.$set(this.value.spec, 'valuesContent', currentValue);
      this.save(buttonCb);
    },
    async loadDeps() {
      const hash = await allHash({ catalogs: this.$store.dispatch('cluster/findAll', { type: CATALOG }) });

      
      let name;
      let namespace;

      name = this.$route.query.name || this.value.metadata?.annotations['edgeapi.cattle.io/catalogs'];
      namespace = this.$route.query.namespace || this.value.metadata.namespace;
      const catalog = hash.catalogs.filter( (C) => {
        return name === C.metadata.name && namespace === C.metadata.namespace;
      });
      console.log('=------', this.$route.query, this.value, name, namespace, catalog);
      const appArr = catalog[0].spec.indexFile?.entries;

      this.value.spec.repo = catalog[0].spec.url;

      this.catalogs = appArr;
    },
    defaultImg() {
      return require(`static/generic-catalog.svg`);
    },
    onInput(value) {
      this.currentValue = value;
    },
    onReady(cm) {
      cm.getMode().fold = 'yaml';

      if ( this.isCreate ) {
        cm.execCommand('foldAll');
      }
    },
    onChanges(cm, changes) {
      if ( changes.length !== 1 ) {
        return;
      }

      const change = changes[0];

      if ( change.from.line !== change.to.line ) {
        return;
      }

      let line = change.from.line;
      let str = cm.getLine(line);
      let maxIndent = indentChars(str);

      if ( maxIndent === null ) {
        return;
      }

      cm.replaceRange('', { line, ch: 0 }, { line, ch: 1 }, '+input');

      while ( line > 0 ) {
        line--;
        str = cm.getLine(line);
        const indent = indentChars(str);

        if ( indent === null ) {
          break;
        }

        if ( indent < maxIndent ) {
          cm.replaceRange('', { line, ch: 0 }, { line, ch: 1 }, '+input');

          if ( indent === 0 ) {
            break;
          }

          maxIndent = indent;
        }
      }

      function indentChars(str) {
        const match = str.match(/^#(\s+)/);

        if ( match ) {
          return match[1].length;
        }

        return null;
      }
    },
  }
};
</script>

<template>
  <div>
    <CatalogHeader>
      <template v-slot:name>
        应用商店: {{ app }}
      </template>
    </CatalogHeader>

    <div class="box">
      <div class="mqtt-info">
        <img v-real-img="icon" :src="defaultImg()" alt="" />
        <div class="introduce">
          <div class="name">
            {{ app }}
          </div>
          <div class="desc">
            {{ description }}
          </div>
        </div>
      </div>

      <form>
        <div class="config">
          <NameNsDescription v-model="value" :mode="mode" :extra-columns="['type']">
            <template v-slot:type>
              <LabeledSelect v-model="value.spec.version" label="版本" :options="versions" />
            </template>
          </NameNsDescription>

          <Collapse>
            <template v-slot:title>
              <span class="type">配置选项</span>
              <span class="desc">Helm模版接受逗号做为分隔符的字符串列表</span>
            </template>

            <div class="yaml-info">
              <div class="desc">
                粘贴或上传yml/yaml格式的应答参数
              </div>
            </div>

            <div class="row">
              <CodeMirror
                :value="currentValue"
                :options="cmOptions"
                :footer-space="71"
                class="fill-window col span-12"
                @onInput="onInput"
                @onReady="onReady"
                @onChanges="onChanges"
              />
            </div>
          </Collapse>
        </div>
        <Footer :mode="mode" :errors="errors" @save="enable" @done="done" />
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
 .box {
    .mqtt-info {
      display: flex;
      margin-left: 80px;
      margin-bottom: 20px;

      img {
        width: 110px;
        height: 110px;
      }

      .introduce {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 30px;

        .name {
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 600;
        }
      }
    }

    .yaml-info {
      display: flex;
      margin-bottom: 20px;
    }

    .yaml {
      display: flex;
      flex: 1;
      height: 500px;
      padding: 0 20px 0 20px;
      margin-bottom: 20px;
    }

    .fill-window {
      width: 100%;
      height: 500px;
    }

    .action {
      display: flex;
      justify-content: center;
    }

    .cancel {
      margin-left: 10px;
    }
  }
</style>
