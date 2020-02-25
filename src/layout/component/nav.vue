<template>
  <div id="nav">
    <el-menu
      router
      :default-active="currentPath"
      class="el-menu-vertical-demo"
    >
      <el-menu-item index="/setting">
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

<script lang="ts" >
import { Route } from 'vue-router';
import {
  Component,
  Vue,
  Watch,
} from 'vue-property-decorator';

@Component
export default class Nav extends Vue {
  private currentPath = '';

  @Watch('$route')
  public onRouteChanged(to: Route): void {
    this.currentPath = to.path;
  }

  mounted(): void {
    this.currentPath = this.$route.path;
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common/var.scss";

#nav {
  .el-menu-vertical-demo {
    background-color: $app-menu-bg;
  }

  .el-menu-item.is-active {
    color: $menu-active;
    background-color: $app-menu-active-bg !important;
  }

  a {
    text-decoration: none;
  }

  .router-link-active {
    text-decoration: none;
  }
}
</style>
