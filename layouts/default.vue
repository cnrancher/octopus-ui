<script>
/* eslint-disable */
import { mapState } from 'vuex';
import { addObject, removeObject } from '@/utils/array';
import { THEME } from '@/store/prefs';
import applyTypeConfigs from '@/config/type-config';
import PromptRemove from '@/components/PromptRemove';
import ActionMenu from '@/components/ActionMenu';
import Menu from '@/components/nav/Menu';
import { NORMAN, RANCHER } from '@/config/types';

applyTypeConfigs();

export default {
  components: {
    PromptRemove,
    Menu,
    ActionMenu,
  },

  middleware: ['authenticated'],

  head() {
    const theme = this.$store.getters['prefs/get'](THEME);

    return {
      bodyAttrs: { class: `theme-${ theme } overflow-hidden dashboard-body` },
      title:     'Dashboard',
    };
  },

  data() {
    return { packages: [] };
  },

  computed: {
    
  },

  methods: {
    toggleNoneLocale() {
      this.$store.dispatch('i18n/toggleNone');
    }
  }
};
</script>

<template>
  <div class="dashboard-root">
    <div class="top">
      <div class="logo" alt="Logo" />
      <div class="system-name">OCTOPUS</div>
    </div>

    <nav>
      <Menu />
    </nav>

    <main>
      <nuxt class="outlet" />
    </main>

    <ActionMenu />
    <PromptRemove />
  </div>
</template>

<style lang="scss" scoped>
  .dashboard-root {
    display: grid;
    height: 100vh;

    grid-template-areas:
      "top      top"
      "nav      main";

    grid-template-columns: var(--nav-width)     auto;
    grid-template-rows:    var(--header-height) auto;

    > .top {
      grid-area: top;
      background-color: var(--header-bg);
      display: flex;
      align-items: center;

      .logo {
        background-color: var(--header-logo);
        mask: url("~assets/images/logo.png") no-repeat center;
        height: 44px;
        width: 44px;
        margin-left: 20px;
      }

      .system-name {
        margin: 0 44px 0 16px;
        font-size: 24px;
        line-height: 36px;
        color: #fff;
      }
    }

    NAV {
      grid-area: nav;
      position: relative;
      background-color: var(--header-bg);
      overflow-y: auto;

      .header {
        background: transparent;
      }
    }

    > .switcher {
      margin: 10px 0 0 0;
      text-align: center;
    }
  }

  MAIN {
    grid-area: main;
    overflow: auto;

    .outlet {
      padding: 20px 20px 70px 20px;
      min-height: 100%;
      margin-bottom: -51px;
    }

    FOOTER {
      background-color: var(--nav-bg);
      height: var(--footer-height);
    }

    HEADER {
      display: grid;
      grid-template-areas: "title actions";
      grid-template-columns: "auto min-content";
      margin-bottom: 20px;

      H1 {
        grid-area: title;
        margin: 0;
        padding-top: 4px;

        .nuxt-link-active {
          padding-right: 10px;
        }
      }

      .actions {
        grid-area: actions;
        text-align: right;
        padding-top: 10px;
      }
    }

  }
</style>
