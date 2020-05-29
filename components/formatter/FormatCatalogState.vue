<script>
export default {
  props: {
    value: {
      type:     Object,
      required: true
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
  data() {
    return { };
  },
  computed: {
    state() {
      const conditions = this.value?.conditions || [];

      return conditions.every(O => O.status === 'True');
    }
  }
};
</script>

<template>
  <span>
    <el-tag v-if="state" type="success">Active</el-tag>
    <el-tag v-else type="success">Error</el-tag>
  </span>
</template>
