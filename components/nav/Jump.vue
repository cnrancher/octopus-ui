<script>
import { debounce } from 'lodash';
import Group from '@/components/nav/Group';
import { isMac } from '@/utils/platform';
import { BOTH, ALL } from '@/store/type-map';

export default {
  components: { Group },

  data() {
    return {
      isMac,
      value:       '',
      groups:      null,
      isFocused:   false,
      blurTimer:   null,
    };
  },

  computed: {
    placeholder() {
      if ( this.isFocused ) {
        return 'Type to search...';
      } else if ( isMac ) {
        return 'Jump to... (\u2318-K)';
      } else {
        return 'Jump to... (Ctrl+K)';
      }
    },
  },

  watch: {
    value() {
      this.queueUpdate();
    },
  },

  mounted() {
    this.updateMatches();
    this.queueUpdate = debounce(this.updateMatches, 250);
  },

  methods: {
    focused() {
      this.show();
    },

    blurred() {
      clearTimeout(this.blurTimer);
      this.blurTimer = setTimeout(() => {
        this.hide();
      }, 200);
    },

    hotkey() {
      this.$refs.input.focus();
      this.$refs.input.select();
    },

    show() {
      this.isFocused = true;
      clearTimeout(this.blurTimer);
    },

    hide() {
      this.isFocused = false;
      this.value = '';
    },

    updateMatches() {
      const clusterId = this.$store.getters['clusterId'];
      const isAllNamespaces = this.$store.getters['isAllNamespaces'];

      let namespaces = null;

      if ( !isAllNamespaces ) {
        namespaces = Object.keys(this.$store.getters['namespaces']());
      }

      const allTypes = this.$store.getters['type-map/allTypes']() || {};
      const out = this.$store.getters['type-map/getTree'](ALL, allTypes, clusterId, BOTH, namespaces, null, this.value);

      this.groups = out;
    },
  },
};
</script>

<template>
  <div>
    <div class="search-wrapper">
      <input
        ref="input"
        v-model="value"
        :placeholder="placeholder"
        class="search"
        type="search"
        @focus="focused"
        @blur="blurred"
        @keyup.esc="hide"
      />
    </div>
    <div v-if="isFocused" class="results">
      <div v-for="g in groups" :key="g.name" class="package">
        <Group
          :key="g.name"
          id-prefix=""
          :group="g"
          :custom-header="true"
          :can-collapse="false"
          :is-expanded="true"
        >
          <template slot="accordion">
            <h6>{{ g.label }}</h6>
          </template>
        </Group>
      </div>
    </div>
    <button v-shortkey="{windows: ['ctrl', 'k'], mac: ['meta', 'k']}" class="hide" @shortkey="hotkey()" />
  </div>
</template>

<style lang="scss">
  .search-wrapper {
    margin: 0 8px;
    .search {
      position: relative;
      width: 100%;
      background-color: #434966;
      border-color: var(--input-checkbox-background);
      opacity: 0.8;
      &:hover {
        background-color: #434966;
        opacity: 1;
      }
      &:focus {
        background-color: #434966!important;
        color: var(--menu-text)!important;
      }
    }
  }

  .results {
    position: absolute;
    top: 170px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 1;
    background: var(--body-bg);
    border: solid var(--border) thin;
    padding: 0 10px;
    box-shadow: 0px 8px 16px 0px var(--shadow);
    .child {
      &.nuxt-link-exact-active {
        background-color: #f5f7fd!important;
        .label, .count {
          color: var(--link-text)!important;
          opacity: 1;
        }
      }
      .label, .count {
        color: #585858;
      }
    }
  }
</style>
