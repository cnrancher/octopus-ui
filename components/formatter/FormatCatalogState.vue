<script>
export default {
  props: { // TODO: value is not Object, is undefined
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
      const conditions = this.col.status?.conditions || [];

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
