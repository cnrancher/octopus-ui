<script>
export default { name: 'Menu' };
</script>

<template>
  <div class="menu">
    <el-menu default-active="/device/edge.cattle.io.v1alpha1.devicelink">
      <nuxt-link to="/global-overview">
        <el-menu-item index="global-overview">
          <span>全局概览</span>
        </el-menu-item>
      </nuxt-link>
      <el-submenu index="infrastructure">
        <template slot="title">
          <span>基础设施</span>
        </template>
        <nuxt-link to="/infrastructure">
          <el-menu-item index="infrastructure">
              <span>基础设施1</span>
          </el-menu-item>
        </nuxt-link>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <span>loT管理</span>
        </template>
        <el-submenu index="3-1">
          <template slot="title">设备模版</template>
          <nuxt-link to="/device-model">
            <el-menu-item index="3-1-1">
                <a>
                  <span slot="title">dummy device</span>
                </a>
            </el-menu-item>
          </nuxt-link>
        </el-submenu>
        <nuxt-link to="/device/edge.cattle.io.v1alpha1.devicelink">
          <el-menu-item index="3-2">
              <a>
                <span slot="title">设备列表</span>
              </a>
          </el-menu-item>
        </nuxt-link>
      </el-submenu>
      <nuxt-link to="/edge-ai">
        <el-menu-item index="4">
            <span>边缘AI</span>
        </el-menu-item>
      </nuxt-link>
      <el-submenu index="5">
        <template slot="title">
          <span>MQTT管理</span>
        </template>
        <nuxt-link to="/mqtt-management">
          <el-menu-item index="5-1">
              <a>
                <span slot="title">MQTT管理1</span>
              </a>
          </el-menu-item>
        </nuxt-link>
      </el-submenu>
      <el-submenu index="6">
        <template slot="title">
          <span>系统管理</span>
        </template>
        <nuxt-link to="/setting">
          <el-menu-item index="setting">
              <a>
                <span slot="title">系统管理1</span>
              </a>
          </el-menu-item>
        </nuxt-link>
      </el-submenu>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
  .menu {
    .el-menu {
      background-color: var(--header-bg);
      border: 0px;

      a {
        color: #fff;
        font-size: 16px;
        .el-menu-item {
          color: #fff;
          font-size: 16px;
          span {
            color: #fff;
            font-size: 16px;
          }
        }
      }

      a {
        color: #04139c;

        .el-menu-item:hover, .el-menu-item:focus, .el-menu-item.is-active {
          background-color: #fff;
          span {
            color: #04139c;
          }
        }
      }
    }
  }
  
</style>

<style lang="scss">
 
  .el-submenu {
    background-color: var(--header-bg);
    .el-menu-item {
      background-color: var(--header-bg);
    }
  }
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
