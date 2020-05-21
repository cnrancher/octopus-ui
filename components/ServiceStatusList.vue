<script>

function getItemClassname(status) {
  switch (status) {
  case 'success':
    return 'dashboard-icon-tick';
  case 'error':
    return 'dashboard-icon-error';
  case 'unknown':
    return 'dashboard-icon-question';
  default:
    return 'dashboard-icon-question';
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
    <li v-for="statusItem in list" :key="statusItem.name" :class="statusItem.classname">
      <i></i>
      <span>{{ statusItem.name }}</span>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
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
      min-height: 40px;
      background-color: #ddd;
      min-width: 228px;
      line-height: 1;
      color: #454545;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      i {
        width: 42px;
        height: 42px;
        line-height: 2.6;
        color: #fff;
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        font-style: normal;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
      }
      span {
        line-height: 1;
        padding-left: 10px;
        font-size: 17px;
        font-weight: bold;
        display: inline-block;
        vertical-align: middle;
      }
    }
    li:last-child {
      margin-right: 0;
    }
    .dashboard-icon-tick {
      border: 1px solid #8dc449;
      // i {
      //   background: url('~assets/images/dashboard-tick.png') no-repeat center #8dc449;
      // }
    }
    .dashboard-icon-question {
      border: 1px solid #fac40f;
      // i {
      //   background: url('~assets/images/dashboard-question.png') no-repeat center #fac40f;
      // }
    }
    .dashboard-icon-error {
      border: 1px solid #ee5558;
      // i {
      //   background: url('~assets/images/dashboard-fork.png') no-repeat center #ee5558;
      // }
    }
  }
</style>
