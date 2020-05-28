<script>
export default {
  props: {
    label: {
      type:     String,
      required: true
    },
    value: { type: String }
  }
};
</script>
<template>
  <div class="labelValue">
    <span class="label">{{ label }}</span>
    <span>{{ value }}</span>
  </div>
</template>

<style lang="scss">
.labelValue {
  display: flex;
  padding: 10px 10px;

  .label {
    width: 130px;
    color: #999;
  }
}
</style>
