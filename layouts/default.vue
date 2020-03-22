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
      <div class="login-info">
        <img src="~/assets/images/people.png" class="people" alt="people">
        <span class="name">jian@rancher</span>
        <i class="el-icon-caret-bottom"></i>
      </div>
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

    > .top {
      grid-area: top;
      background-color: var(--header-bg);
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
      }

      .login-info {
        display: flex;
        align-items: center;
        margin: 0 24px 0 auto;
        
        .people {
          width: 48px;
          height: 48px;
        }

        .name {
          margin: 0 10px 0 15px;
          font-size: 16px;
          color: #fff;
        }

        i {
          color: #fff;
          font-size: 28px;
        }
      }
    }

    nav {
      grid-area: nav;
      position: relative;
      background-color: var(--menu-bg);
      overflow-y: auto;

      .header {
        background: transparent;
      }
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

      .actions {
        grid-area: actions;
        text-align: right;
        padding-top: 10px;
      }
    }

  }
</style>
