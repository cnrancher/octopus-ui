<script>
export default { name: 'Menu' };
</script>

<template>
  <div class="menu">
    <el-menu
      default-active="1"
    >
      <el-menu-item index="1">
        <nuxt-link to="/setting">
          <span>全局概览</span>
        </nuxt-link>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <span>基础设施</span>
        </template>
        <el-menu-item index="2-1">
          <nuxt-link to="/device-model">
            <span>基础设施1</span>
          </nuxt-link>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <span>loT管理</span>
        </template>
        <el-submenu index="3-1">
          <template slot="title">设备模版</template>
          <el-menu-item index="3-1-1">
            <nuxt-link to="/device-model">
              <a>
                <span slot="title">dummy device</span>
              </a>
            </nuxt-link>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="3-2">
          <nuxt-link to="/device/edge.cattle.io.v1alpha1.devicelink">
            <a>
              <span slot="title">设备列表</span>
            </a>
          </nuxt-link>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="4">
        <nuxt-link to="/setting">
          <span>边缘AI</span>
        </nuxt-link>
      </el-menu-item>
      <el-submenu index="5">
        <template slot="title">
          <span>MQTT管理</span>
        </template>
        <el-menu-item index="5-1">
          <nuxt-link to="/device-model">
            <a>
              <span slot="title">MQTT管理1</span>
            </a>
          </nuxt-link>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="6">
        <template slot="title">
          <span>系统管理</span>
        </template>
        <el-menu-item index="6-1">
          <nuxt-link to="/device-model">
            <a>
              <span slot="title">系统管理1</span>
            </a>
          </nuxt-link>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
  .menu {
    .el-menu {
      background-color: var(--header-bg);
      border: 0px;

      .el-menu-item {
        a span {
          color: #fff;
          font-size: 16px;
        }
      }

      .el-submenu {
        .el-menu-item {
          background-color: var(--header-bg);
        }
      }

      .el-menu-item:hover, .el-menu-item:focus, .el-menu-item.is-active {
        background-color: #fff;
        color: #04139c;
        a span {
          color: #04139c;
        }
      }
    }
  }
  
</style>

<style lang="scss">
  .el-menu-item {
    font-size: 16px;
    line-height: 26px;
  }
  .el-menu .el-submenu .el-submenu__title {
    color: #fff;
    font-size: 16px;
  }
  .el-menu {
    .el-submenu {
      .el-submenu__title:hover {
        color:#04139c;
      }
    }
  }
  
</style>
