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
      required: true
    },
  },
};
</script>

<template>
  <span @click="row.goToView">
    <a>
      {{ value }}
    </a>
  </span>
</template>
