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
  },
  data() {
    return { };
  },
};
</script>

<template>
  <span v-html="value">
  </span>
</template>
