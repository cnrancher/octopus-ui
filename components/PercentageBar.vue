<script>
import { formatPercent } from '@/utils/string';
/**
 * A percentage bar which can be used to display how much a resource is being consumed.
 */
export default {
  props: {
    /**
     * A value representing the percentage to be displayed. *Must be a value between 0 and 100*.
     */
    value: {
      type:      Number,
      required:  true,
    },

    /**
     * Indicates the number of tick marks that should be displayed.
     */
    ticks: {
      type:    Number,
      default: 10,
    }
  },

  computed: {
    formattedValue() {
      return formatPercent(this.value);
    },
  },
};
</script>

<template>
  <span class="percentage-bar">
    <span class="outer">
      <span class="inner" :style="{width: formattedValue}"></span>
    </span>
    <span class="percentage">{{ formattedValue }}</span>
  </span>
</template>

<style lang='scss'>
  .percentage-bar {
    .percentage {
      width: 32px;
    }
    .outer {
      min-width: 90px;
      display: inline-block;
      height: 4px;
      background-color: #cfd9f7;
      vertical-align: middle;
      border-radius: 2px;
      overflow: hidden;
      .inner {
        display: inline-block;
        background: linear-gradient(90deg, #8b76df, #727bf5);
        height: 100%;
        vertical-align: top;
      }
    }
  }
</style>
    .percentage {
      vertical-align: middle;
      width: 32px;
    }
    .bar {
      vertical-align: -5px; // this will align percentage-text in the center without having to change the line height
      margin-left: 3px;
      .tick {
        display: inline-block;
        overflow: hidden;
        margin-right: 3px;
        width: 3px;
        font-size: 1.2em;
      }
    }
  }
</style>
