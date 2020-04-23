<script>
export default {
  name:   'MenuItem',
  props: {
    menu: {
      type:     Object,
      required: true,
    },
    fisrtLayer: {
      type:     Boolean,
      required: false
    }
  }
};
</script>
<template>
  <div>
    <template v-if="!menu.children">
      <nuxt-link :key="menu.path" :to="menu.path">
        <el-menu-item
          :index="menu.name"
        >
          <i class="iconfont" :class="menu.meta.icon"></i>
          <span>{{ menu.meta.title }}</span>
        </el-menu-item>
      </nuxt-link>
    </template>

    <template v-else>
      <el-submenu :key="menu.name" :index="menu.name">
        <template slot="title">
          <i class="iconfont" :class="menu.meta.icon"></i>
          <span>{{ menu.meta.title }}</span>
        </template>
        <template v-if="menu.children">
          <div v-if="fisrtLayer" class="shadow-up"></div>
          <menu-item
            v-for="child in menu.children"
            :key="child.name"
            :menu="child"
          />
          <div v-if="fisrtLayer" class="shadow-down"></div>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<style lang="scss" scoped>
  .iconfont{
    font-size: 20px;
    margin-right: 20px;
  }

  .shadow-up {
    height: 10px;
    background-color: var(--menu-second-bg);
    box-shadow: inset 0px 10px 10px var(--menu-second-shadow);
  }

  .shadow-down {
    height: 10px;
    background-color: var(--menu-second-bg);
    box-shadow:inset 0px -10px 10px var(--menu-second-shadow);
  }

  .nuxt-link-exact-active {
    .el-menu-item {
      span, .iconfont {
        color: var(--menu-hover-bg) !important;
      }
    }
    .is-active {
      background-color: var(--menu-hover-bg) !important;
      span, .iconfont {
        color: var(--menu-action-text) !important;
      }
    }
  }
</style>

<style lang="scss">
.el-menu {
  .el-submenu__icon-arrow {
    margin-top: -3px !important;
  }

  .el-menu-item.is-active {
    span, .iconfont {
      color: var(--menu-text);
    }
  }

  .el-submenu.is-active.is-opened {
    .el-submenu__title {
      background-color: var(--menu-hover-bg) !important;
      span, .iconfont {
        color: var(--menu-action-text) !important;
      }
    }
    .nuxt-link-exact-active {
      .is-active {
        background-color: transparent !important;
      }
      span, .iconfont {
        color: var(--menu-hover-bg) !important;
      }
    }
  }

  .el-menu-item, .el-submenu__title {
    &:hover, &:focus {
      background-color: transparent;
      span, .iconfont {
        color: var(--menu-hover-bg);
      }
    }

    padding: 0 20px !important;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: var(--menu-text);
    span {
      font-size: 16px;
    }

  }

  .el-submenu {
    .el-menu-item {
      padding: 0 42px !important;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      span {
        font-size: 14px;
      }
    }

    .el-menu {
      background-color: var(--menu-second-bg);

      .el-menu-item, .el-submenu__title {
        background-color: var(--menu-second-bg);
      }
    }

    .el-menu.el-menu--inline {
      .el-submenu__title {
        background-color: var(--menu-second-bg) !important;
      }
    }
  }

  .el-menu {
    .el-submenu {

      .el-submenu__title {
        span {
          font-size: 14px;
        }
        background-color: var(--menu-second-bg);
      }
      .el-menu-item {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        span {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
