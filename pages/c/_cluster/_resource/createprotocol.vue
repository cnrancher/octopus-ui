<script>
/* eslint-disable */
import jsyaml from 'js-yaml';
import CodeMirror from '@/components/CodeMirror';
import Footer from '@/components/form/Footer';
import BreadCrumbs from '@/components/BreadCrumbs';
import { CATALOG, HELM, NAMESPACE } from '@/config/types';

const DefalutYaml = {
  apiVersion: 'helm.cattle.io/v1',
  kind:       'HelmChart',
};

export default {
  components: {
    CodeMirror,
    Footer,
    BreadCrumbs
  },

  data() {
    return {
      route:   this.$route,
      errors:       null,
      api: {
        customresourcedefinition:   'apiextensions.k8s.io.customresourcedefinition',
        daemonset:                  'apps.daemonset',
        deployment:                 'apps.deployment',
        clusterrolebinding:         'rbac.authorization.k8s.io.clusterrolebinding',
        clusterrole:                'rbac.authorization.k8s.io.clusterrole'
      }
    };
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

  async asyncData(ctx) {
    let jsonData = DefalutYaml;
    let currentValue = jsyaml.safeDump(jsonData);

    return {
      currentValue
    };
  },
  mounted() {
    
  },
  methods: {
    async save(buttonDone) {
      const arr = this.currentValue.split('---');

      try {
        for (let i = 0; i < arr.length; i++) {
          const json = jsyaml.safeLoad(arr[i]);
          const kind = json.kind.toLowerCase();
          console.log('----this.api', kind, this.api[kind])
          const data = await this.$store.dispatch('management/request', {
            method:  'POST',
            headers: {
              'content-type': 'application/json',
              accept:         'application/json',
            },
            url:  `v1/${this.api[kind]}`,
            data: json,
          });
          setTimeout(() => {
            buttonDone(true);
            this.done()
          }, 2000)
        }
      } catch (err) {
        if ( err && err.response && err.response.data ) {
          const body = err.response.data;

          if ( body && body.message ) {
            this.errors = [body.message];
          } else {
            this.errors = [err];
          }
        } else {
          this.errors = [err];
        }

        buttonDone(false);
      }
    },
    done() {
      this.$router.go(-1);
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
    <header>
      <BreadCrumbs class="breadcrumbs" :route="route" />

      <h1>Create DeviceProtocol</h1>
    </header>

    <CodeMirror
      :value="currentValue"
      :options="cmOptions"
      :footer-space="71"
      class="fill-window yaml"
      @onInput="onInput"
      @onReady="onReady"
      @onChanges="onChanges"
    />
    
    <Footer
      mode="create"
      :errors="errors"
      @save="save"
      @done="done"
    />
  </div>
</template>

<style lang="scss" scoped>
.yaml {
  display: flex;
  flex: 1;
  padding: 0 20px 0 20px;
  margin-bottom: 20px;
}
</style>
