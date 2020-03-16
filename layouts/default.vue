<script>
import { mapState } from 'vuex';
import { addObject, removeObject } from '@/utils/array';
import { THEME } from '@/store/prefs';
import applyTypeConfigs from '@/config/type-config';
import PromptRemove from '@/components/PromptRemove';
import Footer from '@/components/nav/Footer';
import ActionMenu from '@/components/ActionMenu';
import { NORMAN, RANCHER } from '@/config/types';

applyTypeConfigs();

export default {
  components: {
    PromptRemove,
    Footer,
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
    <div class="cluster">
      <div class="logo" alt="Logo" />
    </div>

    <div class="top"></div>

    <div class="user">
      设置
    </div>

    <nav>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
      >
        <el-submenu index="1">
          <template slot="title">
            Device Model
          </template>
          <el-menu-item index="2-1">
            <nuxt-link to="/device-model">
              <a>
                <span slot="title">dummy device</span>
              </a>
            </nuxt-link>
          </el-menu-item>
        </el-submenu>
        
        <el-menu-item index="2">
          <nuxt-link to="/device/edge.cattle.io.v1alpha1.devicelink">
            <a>
              <span slot="title">Device Link</span>
            </a>
          </nuxt-link>
        </el-menu-item>
        <el-menu-item index="2">
          <nuxt-link to="/setting">
            <a><span slot="title">Setting</span></a>
          </nuxt-link>
        </el-menu-item>
      </el-menu>
    </nav>

    <main>
      <nuxt class="outlet" />
      <Footer />
    </main>

    <div class="wm">
      <!-- <WindowManager /> -->
    </div>

    <ActionMenu />
    <PromptRemove />
  </div>
</template>

<style lang="scss">
  .dashboard-root {
    display: grid;
    height: 100vh;

    grid-template-areas:
      "cluster  top   back user"
      "nav      main  main main"
      "switcher main  main main"
      "wm       wm    wm   wm";

    grid-template-columns: var(--nav-width)     auto 0px                  var(--header-height);
    grid-template-rows:    var(--header-height) auto var(--footer-height) var(--wm-height, 0px);

    &.back-to-rancher {
      grid-template-columns: var(--nav-width) auto 150px var(--header-height);
    }

    > .cluster {
      grid-area: cluster;
      background-color: var(--header-bg);
      position: relative;

      .logo {
        background-color: var(--header-logo);
        mask: url("~assets/images/logo.svg") no-repeat center;
        height: 30px;
        width: 64px;
        position: absolute;
        top: 9px;
        left: -30px;
        z-index: 2;
      }
    }

    > .top {
      grid-area: top;
      background-color: var(--header-bg);
      padding-top: 8px;

      .filter {
        margin-left: 10px;

        .vs__dropdown-toggle {
          background: var(--header-dropdown);
          border-radius: var(--border-radius);
          border: none;
        }
      }
    }

    > .back {
      grid-area: back;
      background-color: var(--header-bg);

      A {
        line-height: var(--header-height);
        display: block;
        color: var(--body-text);
        padding: 0 5px;
        text-align: right;
      }
    }

    > .user {
      grid-area: user;
      background-color: var(--header-bg);
      padding: 5px;
    }

    NAV {
      grid-area: nav;
      position: relative;
      background-color: var(--nav-bg);
      padding: 0 10px;
      overflow-y: auto;

      .package:not(:first-child) {
        margin-top: 20px;
      }

      .header {
        background: transparent;
      }

      H6 {
        margin: 0;
        letter-spacing: 0.1em;
        line-height: initial;
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

  .wm {
    grid-area: wm;
  }
</style>
