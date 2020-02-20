<template>
  <div id="nav">
    <el-menu
      router
      default-active="/"
      class="el-menu-vertical-demo"
      background-color="#d3dce6"
    >
      <el-menu-item index="/">
        <i class="el-icon-setting"></i>
        <span>Setting</span>
      </el-menu-item>
      <el-menu-item index="/device">
        <i class="el-icon-menu"></i>
        <span>Device</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
#nav {
  .el-menu-item.is-active {
    color: #0075A8;
    background-color: yellow !important;
  }

  a {
    text-decoration: none;
  }

  .router-link-active {
    text-decoration: none;
  }
}
</style>
