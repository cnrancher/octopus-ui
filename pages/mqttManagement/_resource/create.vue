<script>
/* eslint-disable */
import Collapse from './collapse';
import CatalogHeader from './header';
import CodeMirror from '@/components/CodeMirror';
import YAML from 'json2yaml';
import DefalutYaml from './value.json'
import { CATALOGS, HELM, NODE } from '@/config/types';


export default {
  components: {
    Collapse,
    CodeMirror,
    CatalogHeader
  },
  data() {
    return {
      
    }
  },
  mounted() {
    if (this.mode === 'create') {
      this.baseValue.spec.version = this.versions[0]
    }

    if (this.mode === 'edit') {
      let json = jsyaml.safeLoad(this.yaml);
      this.baseValue = json;
      const valuesContent = json.spec.valuesContent;
      const currentValue = jsyaml.safeDump(valuesContent);
      this.currentValue = currentValue;
    }
  },
  computed: {
    isEdit() {
      return this.mode === 'edit'
    },
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
    create(formName) {
      this.baseValue.spec.valuesContent =  '';
      
      this.$refs[formName].validate( async (valid) => {
        if (valid) {
          const data = await this.$store.dispatch('deviceLink/request', {
            method:  'POST',
            headers: {
              'content-type': 'application/json',
              accept:         'application/json',
            },
            url: 'v1/helm.cattle.io.helmcharts',
            data: this.baseValue,
          });

          if (data._status === 201) {
            this.$router.push('/mqttManagement/edgeapi.cattle.io.catalog')
            this.$nextTick(() => {
              this.$refs[formName].resetFields();
            });
          }
          
        } else {
          return false;
        }
      });
    },
    async update(formName) {
      const currentValue = jsyaml.safeLoad(this.currentValue);
      this.baseValue.spec.valuesContent =  currentValue;
      console.log('-------', this.baseValue, this.currentValue)
      this.$refs[formName].validate( async (valid) => {
        if (valid) {
          const data = await this.helmChart.followLink('update', {
            method:  'PUT',
            headers: {
              'content-type': 'application/json',
              accept:         'application/json',
            },
            data: this.baseValue,
          });

          if (data._status === 200) {
            this.$router.push('/mqttManagement/edgeapi.cattle.io.catalog')
            this.$nextTick(() => {
              this.$refs[formName].resetFields();
            });
          }
          
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.$router.push('/mqttManagement/edgeapi.cattle.io.catalog');
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
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
    const { id, app, mode } = route.query;

    const helmChart = await store.dispatch('deviceLink/find', { type: HELM, opt:  { force: true }, id });
    let yaml = ''
    if (mode === 'edit') {
      yaml = (await helmChart.followLink('view', { headers: { accept: 'application/yaml' } })).data;
    }

    let jsonData= DefalutYaml;
    let currentValue = ''
    if (mode === 'create') {
      jsonData = DefalutYaml;
      currentValue = jsyaml.safeDump(jsonData.spec.valuesContent);
      console.log('----DefalutYaml', DefalutYaml);
    }
    console.log('yaml---', yaml)
    const catalogs = await store.dispatch('deviceLink/findAll', { type: CATALOGS, opt:  { url: `${CATALOGS}s` } });
    const nodes = await store.dispatch('deviceLink/findAll', { type: NODE, opt: { url: NODE } });

    const list = catalogs[0].spec.indexFile.entries;
    const node = nodes.map(N => {
      return {
        value: N.id
      }
    })
    return {
      catalogs: list,
      helmChart,
      baseValue: jsonData,
      currentValue,
      node,
      id,
      app,
      mode,
      yaml
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
                <el-form-item label="名称"
                  :prop="'metadata.name'"
                  :rules="[
                    { required: true, message: '请输入名称', trigger: 'blur' },
                  ]"
                >
                  <el-input v-model="baseValue.metadata.name" :disabled="isEdit"></el-input>
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
                <el-form-item label="命名空间"
                  :prop="'spec.targetNamespace'"
                  :rules="[
                    { required: true, message: '请选择命名空间', trigger: 'blur' },
                  ]"
                >
                  <el-select
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

                  <template v-if="mode==='create'">
                    <el-button type="primary" @click="create('form')">启动</el-button>
                  </template>

                  <template v-if="mode==='edit'">
                    <el-button type="primary" @click="update('form')">升级</el-button>
                  </template>

                  <el-button @click="cancel('form')" class="cancel">取消</el-button>
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
