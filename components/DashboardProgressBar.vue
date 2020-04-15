<script>
const FULL_RADIUS = 0.95;

export default {
  props: {
    title: {
      type:    String,
      default: null
    },
    unit: {
      type:    String,
      default: null
    },
    list: {
      type:    Array,
      default: () => []
    }
  },
  data() {
    const tempList = this.list.map((item) => {
      item.width = `${ item.percent * FULL_RADIUS }%`;

      return item;
    });

    return { displayList: tempList };
  }
};
</script>
<template>
  <div class="progress-item">
    <p class="progress-item-title">
      <span>{{ title }}</span>
      <span>{{ unit }}</span>
    </p>
    <ul class="bar-wrapper">
      <li v-for="progress in displayList" :key="progress.index">
        <div class="bar-container"></div>
        <div :style="{width: progress.width}" class="progress-bar"></div>
        <div class="progress-bar-text">
          {{ progress.name }}
        </div>
        <div class="bar-text">
          {{ progress.value }}
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
  .balance {
    border: 1px solid #ddd;
    padding: 0.83vw 0.5vw;
    .progress-item {
      margin-top: 1.45vw;
      width: 100%;
      .progress-item-title {
        color: #fff;
        background: #404aaf;
        padding: 5px 10px 5px 20px;
        span:last-child {
          float: right;
          font-size: 12px;
        }
      }
    }
    .bar-wrapper {
      padding: 10px;
      border: 1px solid #ddd;
      margin-top: 0;
      li {
        list-style: none;
        width: 100%;
        height: 12px;
        padding-right: 20px;
        position: relative;
        margin: 0 0 20px;
        .bar-container{
          height: 100%;
          width: 95%;
          background-color: #0f1ca0;
          opacity: 0.2;
          border-radius: 20px;
          position: absolute;
          top: 0;
          left: 0;
          /* justify-content: space-between; */
        }
        .progress-bar {
          height: 100%;
          border-radius: 20px;
          background-color: #2048ce;
          background-image: linear-gradient(90deg, #2048ce, #161e73);
          width: 27%;
          opacity: 1;
          position: absolute;
          top: 0;
          left: 0;
        }
        .progress-bar-text {
          height: 100%;
          width: 100%;
          padding-left: 5px;
          position: absolute;
          top: 0;
          left: 0;
          font-size: 12px;
          color: #fff;
        }
        .bar-text {
          position: absolute;
          width: 24px;
          right: -2%;
          text-align: center;
          font-weight: bold;
          color: #1245d9;
        }
      }
      li:last-child {
        margin-bottom: 0;
      }
    }
  }

</style>
