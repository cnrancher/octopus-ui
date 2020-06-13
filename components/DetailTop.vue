<script>
export default {
  props: {
    columns: {
      type:    Array,
      default: () => []
    },
    gridNum: {
      type:    Number,
      default: 4
    }
  },
  computed: {
    gridClass() {
      return `detail-grid-${ this.gridNum }`;
    }
  }
};
</script>

<template>
  <div class="detail-top" :class="gridClass">
    <div v-for="col in columns" :key="col.title" class="detail-top-item">
      <div class="detail-icon">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="col.icon"></use>
        </svg>
      </div>
      <div class="detail-content">
        <label>{{ col.title }}</label><br />
        <slot :name="col.name">
          <span>{{ col.content || col.content === 0 ? col.content : col.fallback || 'n/a' }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  $sm-screen-grid: 1fr;
  $md-screen-grid: 1fr 1fr;
  $default-screen-grid: 1fr 1fr 1fr 1fr;

  .detail-top {
    display: grid;
    grid-template-columns: $default-screen-grid;
    grid-gap: 10px;
    padding: 0;

    .detail-top-item {
      border: 1px solid var(--border);
      background-color: var(--body-bg);
      display: grid;
      grid-template-columns: 30% 70%;
      padding: 25px 0;
      border-radius: 4px;
      box-shadow: 1px 2px 10px -1px var(--border);
      .detail-icon {
        text-align: center;
        .icon {
          width: 4em;
          height: 4em;
          vertical-align: -0.15em;
          fill: currentColor;
          overflow: hidden;
        }
      }
      .detail-content {
        text-align: center;
        & > * {
          padding: 0 10px;
          line-height: 1.5;
          color: var(--detail-top-label);

          & :last-child {
            padding-right: 0;
          }
        }
        LABEL {
          color: var(--body-text);
          padding-right: 5px;
          margin: 0;
          font-size: 18px;
        }
        SPAN, A {
          font-size: 16px;
        }
      }
    }
    &.detail-grid-3 {
      grid-template-columns: 1fr 1fr 1fr;
      .detail-top-item {
        grid-template-columns: 20% 80%;
      }
    }
  }

  @media only screen and (min-width: map-get($breakpoints, '--viewport-4')) {
    .detail-top {
      grid-template-columns: $sm-screen-grid;
    }
  }

  @media only screen and (min-width: map-get($breakpoints, '--viewport-7')) {
    .detail-top {
      grid-template-columns: $md-screen-grid;
    }
  }

  @media only screen and (min-width: map-get($breakpoints, '--viewport-9')) {
    .detail-top {
      grid-template-columns: $default-screen-grid;
      &.detail-grid-3 {
        grid-template-columns: 1fr 1fr 1fr;
      }
    }
  }

</style>
