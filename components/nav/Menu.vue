<script>
import MenuItem from '@/components/nav/MenuItem';
import { MENUS } from '@/config/menu.js';

export default {
  name:       'Menu',
  components: { MenuItem },
  data() {
    return { openeds: [] };
  },
  computed:   {
    MENUS() {
      const { dynamicMenu } = this.$store.state;
      const addMenu = dynamicMenu.map((element) => {
        const item = {
          path: `/device-model/${ element.spec.names.kind.toLowerCase() }`,
          meta: { title: `${ element.spec.names.kind }` }
        };

        return item;
      });

      MENUS.find((element, index) => {
        if (element.name === 'lot-management') {
          MENUS[index].children[0].children = addMenu;
        }

        return element.name === 'lot-management';
      });

      return MENUS;
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
    <div class="menu-top hand" @click="closeAll">
      <img src="~/assets/images/menu-logo.png" alt="">
    </div>
    <el-menu default-active="/global-overview" :default-openeds="openeds">
      <MenuItem
        v-for="menu in MENUS"
        :key="menu.name"
        :menu="menu"
        :fisrt-layer="true"
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
