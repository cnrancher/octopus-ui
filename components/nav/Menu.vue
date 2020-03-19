<script>
export default { 
  name: 'Menu'
};
</script>

<template>
  <div class="menu">
    <el-menu default-active="/device/edge.cattle.io.devicelink">
      <nuxt-link to="/global-overview">
        <el-menu-item index="global-overview">
          <img src="~/assets/images/global-resource.png"><span>全局概览</span>
        </el-menu-item>
      </nuxt-link>
      <el-submenu index="infrastructure">
        <template slot="title">
          <img src="~/assets/images/infrastructure.png"><span>基础设施</span>
        </template>
        <nuxt-link to="/infrastructure">
          <el-menu-item index="infrastructure">
              <span>基础设施1</span>
          </el-menu-item>
        </nuxt-link>
      </el-submenu>
      <nuxt-link to="/workload">
        <el-menu-item index="workload">
          <img src="~/assets/images/workload.png"><span>工作负载</span>
        </el-menu-item>
      </nuxt-link>
      <el-submenu index="3">
        <template slot="title">
          <img src="~/assets/images/iot-management.png"><span>loT管理</span>
        </template>
        <el-submenu index="3-1">
          <template slot="title">设备模版</template>
          <nuxt-link to="/device-model/dummydevice">
            <el-menu-item index="3-1-1">
                <a>
                  <span slot="title">DummyDevice</span>
                </a>
            </el-menu-item>
          </nuxt-link>
          <nuxt-link to="/device-model/bluetoolthdevice">
            <el-menu-item index="3-1-2">
                <a>
                  <span slot="title">BluetoothDevice</span>
                </a>
            </el-menu-item>
          </nuxt-link>
          <nuxt-link to="/device-model/modbusdevice">
            <el-menu-item index="3-1-3">
                <a>
                  <span slot="title">ModbusDevice</span>
                </a>
            </el-menu-item>
          </nuxt-link>
        </el-submenu>
        <nuxt-link to="/device/edge.cattle.io.devicelink">
          <el-menu-item index="3-2">
              <a>
                <span slot="title">设备列表</span>
              </a>
          </el-menu-item>
        </nuxt-link>
      </el-submenu>
      <nuxt-link to="/edge-ai">
        <el-menu-item index="4">
          <img src="~/assets/images/edge-ai.png"><span>边缘AI</span>
        </el-menu-item>
      </nuxt-link>
      <el-submenu index="5">
        <template slot="title">
          <img src="~/assets/images/mqtt.png"><span>MQTT管理</span>
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
          <img src="~/assets/images/setting.png"><span>系统管理</span>
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
  img {
    margin-right: 10px;
    margin-top: -2px;
  }
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
