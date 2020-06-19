<script>
import VStack from '@/components/Layout/Stack/VStack';

const STATUS_CLASS_MAP = {
  success: {
    container: 'text-success',
    icon:      '#icon-circle-active'
  },
  warning: {
    container: 'text-warning',
    icon:      '#icon-circle-error'
  },
  info: {
    container: 'text-info',
    icon:      '#icon-circle-error'
  },
  error: {
    container: 'alert-bg-error text-error',
    icon:      '#icon-circle-error'
  }
};

export default {
  components: { VStack },
  props:      {
    status: {
      type: String,
      validator(value) {
        return Object.keys(STATUS_CLASS_MAP).includes(value);
      },
      required: true
    },
    message: {
      type:     String,
      required: true
    }
  },
  computed: {
    containerClasses() {
      return STATUS_CLASS_MAP[this.status].container;
    },
    iconClasses() {
      return STATUS_CLASS_MAP[this.status].icon;
    }
  }
};
</script>

<template>
  <VStack class="alert" :class="containerClasses" vertical-align="center">
    <div>
      <i class="icon" :class="iconClasses" />
      <svg class="icon" aria-hidden="true">
        <use :xlink:href="iconClasses"></use>
      </svg>
      <span class="pl-20">{{ message }}</span>
    </div>
  </VStack>
</template>

<style lang="scss" scoped>
.alert-bg-error {
    background-color: rgba(var(--error), 0.5)
}
.alert {
  > DIV > SPAN {
    color: var(--body-text);
    font-size: 16px;
  }
  .icon {
    width: 1.5em;
    height: 1.5em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
}
</style>
