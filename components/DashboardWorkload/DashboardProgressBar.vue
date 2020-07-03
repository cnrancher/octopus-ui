<script>
import CopyCode from '@/components/CopyCode';

export default {
  name:       'DashboardProgressBar',
  components: { CopyCode },
  props:      {
    list: {
      type:    Array,
      default: () => []
    },
    barColor: {
      type:    String,
      default: 'linear-gradient(90deg, #2048ce, #161e73)'
    }
  },
  computed: {
    displayList() {
      const tempList = this.list.map((item) => {
        item.width = `${ item.percent }%`;

        return item;
      });

      return tempList;
    }
  }
};
</script>
<template>
  <ul class="bar-wrapper">
    <li v-for="progress in displayList" :key="progress.index">
      <div class="bar-container">
        <div :style="{width: progress.width, background: barColor}" class="progress-bar"></div>
        <div class="progress-bar-text">
          <CopyCode>{{ progress.name }}</CopyCode>
        </div>
      </div>
      <div class="bar-text">
        {{ progress.value }}
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
  .bar-wrapper {
    padding: 10px 0 10px 10px;
    border: 1px solid #ddd;
    margin-top: 0;
    min-height: 300px;
    li {
      list-style: none;
      width: 100%;
      height: 17px;
      line-height: 17px;
      padding-right: 20px;
      position: relative;
      margin: 0 0 20px;
      .bar-container{
        height: 100%;
        width: 88%;
        background-color: #cfd2ec;
        border-radius: 20px;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
      }
      .progress-bar {
        height: 100%;
        border-radius: 20px;
        width: 27%;
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
        code {
          font-family: 'prompt-light'!important;
        }
      }
      .bar-text {
        position: absolute;
        width: 10%;
        right: 0;
        text-align: left;
        font-weight: bold;
        color: #1245d9;
      }
    }
    li:last-child {
      margin-bottom: 0;
    }
  }
</style>
