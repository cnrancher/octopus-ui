<script>

function getItemClassname(status) {
  switch (status) {
  case 'success':
    return {
      icon: 'icon-system-active',
      type: 'active'
    };
  case 'error':
    return {
      icon: 'icon-system-error',
      type: 'error'
    };
  case 'unknown':
    return {
      icon: 'icon-system-question',
      type: 'question'
    };
  default:
    return {
      icon: 'icon-system-question',
      type: 'question'
    };
  }
}

export default {
  props: {
    list: {
      type:    Array,
      default: () => []
    }
  },

  data() {
    return { displayList: [] };
  },

  watch: {
    list() {
      const tempList = this.list.map((item) => {
        item.classname = getItemClassname(item.status);

        return item;
      });

      return { displayList: tempList };
    }
  }
};
</script>

<template>
  <ul class="dashboard-service">
    <li v-for="statusItem in list" :key="statusItem.name" :class="statusItem.classname.type">
      <span class="type">
        <i :class="['icon', statusItem.classname.icon]"></i>
      </span>
      <span>{{ statusItem.name }}</span>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
  .type-bg {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }

  .dashboard-service {
    display: grid;
    grid-template-columns: repeat(4, 21%);
    grid-column-gap: 4.5%;
    // display: flex;
    // justify-content: space-around;
    padding: 0 0 0 1.2vw;
    margin: 1.45vw 0 1.25vw;
    li {
      list-style: none;
      background-color: #ddd;
      min-width: 228px;
      color: #454545;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      overflow: hidden;
      display: flex;
      i {
        line-height: 40px;
        color: #fff;
        font-size: 16px;
        text-align: center;
        font-style: normal;
      }
      span {
        line-height: 40px;
        font-size: 17px;
        font-weight: bold;
        vertical-align: middle;
        text-align: center;
      }
    }

    li:last-child {
      margin-right: 0;
    }

    .active {
      border: 1px solid #8dc449;
      .type {
        @extend .type-bg;
        background-color: #8dc449;
      }
    }

    .question {
      border: 1px solid #fac40f;
      .type {
        @extend .type-bg;
        background-color: #fac40f;
      }
    }

    .error {
      border: 1px solid #ee5558;
      .type {
        @extend .type-bg;
        background-color: #ee5558;
      }
    }
  }
</style>
