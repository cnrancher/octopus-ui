<script>

export default {
  props: {
    value: {
      type:     Object,
      required: true
    }
  },
};
</script>

<template>
  <span :class="{'badge-state': true, [value.stateBackground]: true}">
    {{ value.stateDisplay }}
  </span>
</template>

<style lang="scss">
  .badge-state {
    padding: 5px 5px 5px 0;
    border: 1px solid transparent;
    border-radius: 2px;
    text-align: center;

    // Successful states are de-emphasized by using [text-]color instead of background-color
    &.bg-success {
      color: var(--success);
      background: var(--badge-success-bg);
    }
    &.bg-error {
      color: var(--body-bg);
      background: var(--badge-error-bg);
    }
    &.bg-warning {
      color: var(--body-text);
      background: var(--badge-warning-bg);
    }
  }

  .sortable-table TD .badge-state {
    @include clip;
    display: inline-block;
    max-width: 100%;
    position: relative;
    padding: 2px 3px;
    font-size: 1em;
    max-width: 110px;
    font-size: .85em;
    vertical-align: middle;
  }
</style>
