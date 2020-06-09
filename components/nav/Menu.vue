<script>
import MenuItem from '@/components/nav/MenuItem';
import { MENUS } from '@/config/menu.js';

export default {
  name:       'Menu',
  components: { MenuItem },
  data() {
    return { MENUS };
  },
  computed: {
    currentMenuName() {
      const currentPath = this.$route.path || '';
      let out = '';

      MENUS.forEach((menuItem) => {
        if (menuItem.children) {
          const currentSubmenuItem = menuItem.children.filter(submenuItem => currentPath === submenuItem.path);

          if (currentSubmenuItem.length > 0) {
            out = menuItem.name;
          }
        } else if (currentPath === menuItem.path) {
          out = menuItem.name;
        }
      });

      return out;
    },
    openeds() {
      return [this.currentMenuName];
    }
  },
  methods: {
    closeAll() {
      this.openeds = [];
    }
  }
};
</script>

<template>
  <div class="menu">
    <!-- <div class="menu-top hand" @click="closeAll">
      <img src="~/assets/images/menu-logo.png" alt="">
    </div> -->
    <el-menu default-active="infrastructure" :default-openeds="openeds">
      <MenuItem
        v-for="menu in MENUS"
        :key="menu.name"
        :menu="menu"
        :fisrt-layer="true"
        :is-exact-active="currentMenuName === menu.name"
      />
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
  .menu {
    .menu-top {
      background-color: var(--menu-bg);
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 18px;
        height: 13px;
      }
    }

    .el-menu {
      background-color: var(--menu-bg);
      border: 0px;

      a {
         color: var(--menu-text);
        font-size: 16px;
        .el-menu-item {
           color: var(--menu-text);
          font-size: 16px;
          span {
            color: var(--menu-text);
            font-size: 16px;
          }
        }
      }
    }
  }
</style>
