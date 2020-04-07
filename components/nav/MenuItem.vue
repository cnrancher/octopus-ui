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
          :index="menu.name || menu.name"
        >
          <div class="img" :style="{backgroundImage:`url(${menu.meta.icon})`}"></div>
          <span>{{ menu.meta.title }}</span>
        </el-menu-item>
      </nuxt-link>
    </template>

    <template v-else>
      <el-submenu :key="menu.name" :index="menu.name">
        <template slot="title">
          <div class="img" :style="{backgroundImage:`url(${menu.meta.icon})`}"></div>
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
  .img {
    display: inline-block;
    background-repeat: no-repeat;
    margin-right: 20px;
    background-position: -25px 0px;
    width: 20px;
    height: 20px;
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

  .el-menu-item, .el-submenu__title {
    &:hover {
      background-color: var(--menu-hover-bg);
      span {
        color: var(--menu-action-text);
      }
      .img {
        background-position: 0px 0px;
      }
    }

    color: var(--menu-text);

  }

  .el-submenu {
    .el-menu {
      background-color: var(--menu-second-bg);
      .el-menu-item, .el-submenu__title {
        background-color: var(--menu-second-bg);

        &:hover {
          background-color: var(--menu-hover-bg);
          .img {
            background-position: 0px 0px;
          }
        }
      }
    }

    .el-menu.el-menu--inline {
      .el-submenu__title {
        background-color: var(--menu-second-bg) !important;
      }

      .el-menu.el-menu--inline {
        li {
          span {
            margin-left: 20px;
          }
        }
      }

    }
  }

  .nuxt-link-exact-active {
    .el-menu-item {
      background-color: var(--menu-hover-bg) !important;
      .img {
        background-position: 0px 0px;
      }
      span {
        color: var(--menu-action-text);
      }
    }
  }

  .el-menu--inline div.li:hover, .el-menu--inline div.li:focus {
    background-color: var(--menu-hover-bg);
    .img {
      background-position: 0px 0px;
    }
    span {
      color: var(--menu-action-text);
    }
  }
</style>

<style lang="scss">
.el-menu {
  .el-submenu__icon-arrow {
    margin-top: -3px !important;
  }
  .el-menu-item.is-active {
    color: var(--menu-text);
  }
  .el-menu-item, .el-submenu__title {
    &:hover {
      color: var(--menu-action-text);
      .img {
        background-position: 0px 0px;
      }
    }
    padding: 0 22px !important;
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
      padding: 0 22px !important;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      span {
        font-size: 14px;
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
        &:hover {
          background-color: var(--menu-hover-bg);
          .img {
            background-position: 0px 0px;
          }
        }
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
