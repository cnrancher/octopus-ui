<script>
import { mapState } from 'vuex';
import { addObject, removeObject } from '@/utils/array';
import { THEME } from '@/store/prefs';
import applyTypeConfigs from '@/config/type-config';
import PromptRemove from '@/components/PromptRemove';
import ActionMenu from '@/components/ActionMenu';
import Menu from '@/components/nav/Menu';
import Logout from '@/components/nav/logout';
import { NORMAN, RANCHER } from '@/config/types';

applyTypeConfigs();

export default {
  components: {
    PromptRemove,
    Menu,
    ActionMenu,
    Logout
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
    return {};
  },

  computed: {},

  methods: {}
};
</script>

<template>
  <div class="dashboard-root">
    <div class="top">
      <div class="logo" alt="Logo" />
      <div class="system-name">OCTOPUS</div>
      <Logout />
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

    grid-template-columns: 208px auto;
    grid-template-rows:    60px auto;

    .top {
      grid-area: top;
      background-color: var(--header-bg-no);
      background-image: var(--header-bg);
      display: flex;
      align-items: center;

      .logo {
        background-color: var(--header-logo);
        mask: url("~assets/images/logo.png") no-repeat center;
        height: 48px;
        width: 48px;
        margin-left: 20px;
      }

      .system-name {
        margin: 0 44px 0 16px;
        font-size: 24px;
        color: #fff;
        flex: 1;
      }
    }

    nav {
      grid-area: nav;
      background-color: var(--menu-bg);
      overflow-y: auto;
    }

    main {
      grid-area: main;
      overflow: auto;

      .outlet {
        padding: 20px 20px 70px 20px;
        min-height: 100%;
        margin-bottom: -51px;
      }
    }
  }
  
</style>
