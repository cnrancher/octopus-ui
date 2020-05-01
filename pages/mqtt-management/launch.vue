<script>
/* eslint-disable */
import Collapse from './collapse';
import catalogHeader from './header';
import CodeMirror from '@/components/CodeMirror';

const currentValue = `apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: my-nginx
  namespace: default
spec:
  chart: nginx
  repo: http://charts.cnrancher.cn/mqtt
  version: 0.1.0
  targetNamespace: kube-system`;

export default {
  components: {
    Collapse,
    CodeMirror,
    catalogHeader
  },
  data() {


    console.log('---cucurrentValue', currentValue);

    return {
      currentValue,
      app: this.$route.query.app,
      sizeForm: {
        name: 'wj'
      }
    }
  },
  computed: {
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
  mounted() {
  },
  methods: {
    async launch() {
      await this.$store.dispatch('deviceLink/request', {
        method:  'POST',
        headers: {
          'content-type': 'application/yaml',
          accept:         'application/json',
        },
        url: 'v1/helm.cattle.io.helmcharts',
        data: this.currentValue,
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
  }
}
</script>

<template>
  <div id="launch">
    <catalogHeader>
      <template v-slot:name>
        应用商店: {{ app }}
      </template>
    </catalogHeader>

    <div class="box">
      <div class="mqtt-info">
        <img :src="defaultImg()" alt="">
        <div class="introduce">
          <div class="name">EMQX</div>
          <div class="desc">A Helm chart for EMQX</div>
        </div>
      </div>

      <div class="config">
        <Collapse>
          <el-form ref="form" :model="sizeForm">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="名称">
                  <el-input v-model="sizeForm.name"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="模版版本">
                  <el-input v-model="sizeForm.name"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="添加描述">
                  <el-input v-model="sizeForm.name"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-divider content-position="center">命名空间</el-divider>
              </el-col>

              <el-col>
                <el-form-item label="命名空间">
                  <el-input v-model="sizeForm.name"></el-input>
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
                  <el-button type="primary" @click="launch">启动</el-button>

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
