<script>
/* eslint-disable */
import Collapse from './collapse';
import CatalogHeader from './header';
import CodeMirror from '@/components/CodeMirror';
import YAML from 'json2yaml';
import { CATALOGS, HELM, NODE } from '@/config/types';

const currentValue = `  replicaCount: 3
  image:
    pullPolicy: IfNotPresent
    repository: emqx/emqx
  resources:
    limits:
      cpu: 500m
      memory: 512Mi
    requests:
      cpu: 500m
      memory: 512Mi
  persistence:
    accessMode: ReadWriteOnce
    enabled: false
    size: 20Mi
  service.type: ClusterIP
  emqxConfig:
    EMQX_CLUSTER__K8S__ADDRESS_TYPE: hostname
    EMQX_CLUSTER__K8S__APISERVER: https://kubernetes.default.svc:443
    EMQX_CLUSTER__K8S__SUFFIX: svc.cluster.local
  emqxLicneseSecretName: null
  tolerations: []
  nodeSelector: {}
  affinity: {}
  ingress:
    annotations: {}
    enabled: false
    hosts:
    - chart-example.local
    path: /
    tls: []`;

const jsonData = {
  "apiVersion": "helm.cattle.io/v1",
  "kind": "HelmChart",
  "metadata": {
    "annotations": {
      "edgeapi.cattle.io/owner-name": "admin",
      "edgeapi.cattle.io/edge-api-server": "true"
    },
    "name": "", // my-mqtt
    "namespace": "kube-system",
    "description": '' // 是否加在这里
  },
  "spec": {
    "chart": "", // emqx
    "repo": "", // http://charts.cnrancher.cn
    "version": "", // v2.0.0-rc.1
    "targetNamespace": "", // default
    "valuesContent": ''
  }
}

export default {
  components: {
    Collapse,
    CodeMirror,
    CatalogHeader
  },
  data() {
    const { id, app, mode } = this.$route.query;

    jsonData.spec.chart = app;
    
    return {
      baseValue: jsonData,
      currentValue,
      app,
      id,
      mode,
    }
  },
  mounted() {
    if (this.mode === 'launch') {
      this.baseValue.spec.version = this.versions[0]
    }

    if (this.mode === 'upgrade') {
      const currentCahrt = this.helmChart.filter( chart => {
        return chart.id === this.id
      })
      console.log('---currentCahrt', currentCahrt)

      this.baseValue.metadata.name = currentCahrt[0].metadata.name;
      this.baseValue.spec.chart = currentCahrt[0].spec.chart;
      this.baseValue.spec.version = currentCahrt[0].spec.version;
      this.baseValue.spec.targetNamespace = currentCahrt[0].spec.targetNamespace;
    }
  },
  computed: {
    description() {
      return this.catalogs[this.app][0].description
    },
    versions() {
      const versions = this.catalogs[this.app].map( V => {
        return V.version
      })

      return versions.sort(function (a, b) {
        return (b).localeCompare(a);
      })
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
    async launch() {
      this.baseValue.spec.valuesContent =  YAML.stringify(this.currentValue);
      await this.$store.dispatch('deviceLink/request', {
        method:  'POST',
        headers: {
          'content-type': 'application/json',
          accept:         'application/json',
        },
        url: 'v1/helm.cattle.io.helmcharts',
        data: this.baseValue,
      });
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
    defaultImg() {
      return require(`static/device-default.png`);
    }
  },
  async asyncData(ctx) {
    const { route, store } = ctx;

    const catalogs = await store.dispatch('deviceLink/findAll', { type: CATALOGS, opt:  { url: `${CATALOGS}s` } });
    const helmChart = await store.dispatch('deviceLink/findAll', { type: HELM, opt:  { url: `${HELM}s` } });

    const nodes = await store.dispatch('deviceLink/findAll', { type: NODE, opt: { url: NODE } });

    const list = catalogs[0].spec.indexFile.entries;
    const node = nodes.map(N => {
      return {
        value: N.id
      }
    })
    console.log('-----log', list, node)
    return {
      catalogs: list,
      helmChart,
      node
    };
  }
}
</script>

<template>
  <div id="launch">
    <CatalogHeader>
      <template v-slot:name>
        应用商店: {{ app }}
      </template>
    </CatalogHeader>

    <div class="box">
      <div class="mqtt-info">
        <img :src="defaultImg()" alt="">
        <div class="introduce">
          <div class="name">{{ app }}</div>
          <div class="desc">{{ description }}</div>
        </div>
      </div>

      <div class="config">
        <Collapse>
          <el-form ref="form" :model="baseValue">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="名称" required>
                  <el-input v-model="baseValue.metadata.name"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="模版版本" required>
                  <el-select v-model="baseValue.spec.version" class="version">
                    <el-option
                      v-for="v in versions"
                      :key="v"
                      :label="v"
                      :value="v"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="添加描述">
                  <el-input v-model="baseValue.metadata.description"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-divider content-position="center">命名空间</el-divider>
              </el-col>

              <el-col>
                <el-form-item label="命名空间" required>
                  <el-select
                    disabled
                    v-model="baseValue.spec.targetNamespace" 
                    class="version"
                    filterable
                    allow-create
                  >
                    <el-option
                      v-for="N in node"
                      :key="N.value"
                      :label="N.value"
                      :value="N.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col>
                <div class="yaml-info">
                  <div class="desc">粘贴或上传yml/yaml格式的应答参数</div>
                </div>

                <div class="yaml">
                  <CodeMirror
                    :value="currentValue"
                    :options="cmOptions"
                    :footer-space="71"
                    @onInput="onInput"
                    @onReady="onReady"
                    @onChanges="onChanges"
                  />
                </div>
              </el-col>

              <el-col>
                <div class="action">

                  <template v-if="mode==='launch'">
                    <el-button type="primary" @click="launch">启动</el-button>
                  </template>

                  <template v-if="mode==='upgrade'">
                    <el-button type="primary">升级</el-button>
                  </template>

                  <nuxt-link to="/mqtt-management" class="cancel">
                    <el-button>取消</el-button>
                  </nuxt-link>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </Collapse>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#launch {
  .el-divider__text {
    background-color: var(--main-bg);
  }

  .version {
    width: 100%;
  }
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
      padding: 0 20px 0 20px;
      margin-bottom: 20px;
    }
    
    .action {
      display: flex;
      justify-content: center;
    }

    .cancel {
      margin-left: 10px;
    }
  }
}
</style>
