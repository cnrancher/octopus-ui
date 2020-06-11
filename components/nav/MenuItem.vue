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
    },
    isExactActive: {
      type:     Boolean,
      required: false
    }
  }
};
</script>
<template>
  <div>
    <template v-if="!menu.children">
      <template>
        <nuxt-link :key="menu.path" :to="menu.path">
          <el-menu-item
            :index="menu.name"
          >
            <div class="info">
              <i class="icon" :class="menu.meta.icon"></i>
              <span class="text">{{ menu.meta.title }}</span>
            </div>
            <span class="bar"></span>
          </el-menu-item>
        </nuxt-link>
      </template>
    </template>

    <template v-else>
      <el-submenu :key="menu.name" :index="menu.name" :class="{'is-exact-active': isExactActive}">
        <template slot="title">
          <div class="info">
            <i class="icon" :class="menu.meta.icon"></i>
            <a class="text">{{ menu.meta.title }}</a>
          </div>
          <span class="bar"></span>
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
  .icon {
    font-size: 20px;
    // margin-right: 20px;
    color: var(--menu-text);
  }

  .shadow-up {
    height: 10px;
    background-image: var(--menu-second-shadow-top);
  }

  .shadow-down {
    height: 10px;
    background-image: var(--menu-second-shadow-bottom);
  }

  .el-submenu__title, .el-menu-item {
    display: flex;
    justify-content: space-between;
    opacity: 0.8;

    &:hover {
      opacity: 1;
      font-weight: var(--nav-font-weight);
      text-decoration: none;
    }

    .icon {
      color: var(--menu-text);
      margin-right: 24px;
    }

    .bar {
      width: 4px;
      background-color: transparent;
      margin-right: -20px;
    }
  }

  .nuxt-link-active {
    &:hover {
      text-decoration: none;
    }
    .is-active {
      background-color: var(--menu-hover-bg) !important;
      .icon {
        color: var(--menu-action-text) !important;
      }
      .text {
        color: var(--menu-text);
      }
    }
  }

  .nuxt-link-exact-active  {
    .el-menu-item {
      font-weight: var(--nav-font-weight);
      opacity: 1;
      background-color: var(--menu-hover-bg) !important;
      .icon {
        color: var(--menu-action-text) !important;
      }
    }
  }
</style>

<style lang="scss">
.el-menu {
  A:hover {
    text-decoration: none;
  }
  .el-submenu__icon-arrow {
    margin-top: -3px !important;
  }

  .el-menu-item.is-active {
    .icon {
      color: var(--menu-text);
    }
  }

  .el-submenu.is-active.is-opened {
    .el-submenu__title {
      background-color: var(--menu-hover-bg) !important;
      .icon {
        color: var(--menu-action-text) !important;
      }
      .bar {
        background-color: var(--menu-action-text) !important;
      }
    }
    .nuxt-link-exact-active {
      .is-active {
        background-color: transparent !important;
      }
      .icon {
        color: var(--menu-text) !important;
      }
    }
  }

  .el-menu-item, .el-submenu__title {
    display: flex;
    justify-content: space-between;

    &:hover, &:focus {
      background-color: transparent;
      .icon {
        color: var(--menu-text);
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
    .el-submenu__title {
      opacity: 0.8;
      &:hover {
        opacity: 1;
        font-weight: var(--nav-font-weight);
        a {
          text-decoration: none;
        }
      }
    }

    &.is-active {
      .el-submenu__title {
        opacity: 1;
        font-weight: var(--nav-font-weight);
      }
    }
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
        .bar {
          background-color: transparent !important;
        }
      }
    }

    .el-menu.el-menu--inline {
      .el-submenu__title {
        background-color: var(--menu-second-bg) !important;
      }
    }
    .text {
      color: var(--menu-text);
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
  .is-exact-active {
    .el-submenu__title {
      opacity: 1;
      font-weight: var(--nav-font-weight);
      background-color: var(--menu-hover-bg) !important;
      .icon {
        color: var(--menu-action-text) !important;
      }
    }

    .bar {
      background-color: var(--menu-action-text) !important;
    }
  }
}
</style>
