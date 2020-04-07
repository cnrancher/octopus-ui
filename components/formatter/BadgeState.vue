<script>

export default {
  props: {
    value: {
      type:     String,
      default: ''
    },
    row: {
      type:     Object,
      required: true
    },
    col: {
      type:     Object,
      default: () => {}
    },
  },
  computed: {
    status() {
      let label = 'Active';
      let bgColor = 'green';

      for (let i = 0; i < this.row?.status?.conditions?.length; i++) {
        const condition = this.row.status.conditions[i];
        if (condition.DeviceCreated && condition.DeviceCreated === 'Unknown') {
          bgColor = 'yellow';
        } else if (condition.status === 'False') {
          bgColor = 'red';
        }
        label = `${ condition.type }:${ condition.status }`;
      }

      return {
        label,
        bgColor
      };
    }
  }
};
</script>

<template>
  <span :class="{'badge-state': true, [row.statusColor]: true}">
    <span class="dot" :class="status.bgColor"></span>{{ status.label }}
  </span>
</template>

<style lang="scss">
  @import "~assets/styles/base/_mixins.scss";

  .badge-state {
    padding: 5px 5px 5px 0;
    border: 1px solid transparent;
    border-radius: 2px;
    display: flex;
    align-items: center;

    // Successful states are de-emphasized by using [text-]color instead of background-color
    &.bg-success {
      color: var(--success);
      background: transparent;
    }
  }

  .sortable-table TD .badge-state {
    @include clip;
    display: inline-block;
    max-width: 100%;
    position: relative;
    padding: 1px 10px 1px 0;
    font-size: 1em;
    font-size: .85em;
    vertical-align: middle;
  }

  .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
    background-color: yellow;
  }

  .red {
    background-color: #ef5a53;
  }
  .green {
    background-color: #96bd7f;
  }
  .yellow {
    background-color: yellow;
  }
</style>
