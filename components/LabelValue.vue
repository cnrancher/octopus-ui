<script>
export default {
  props: {
    label: {
      type:     String,
      required: true
    },
    value: {
      type:     [String, Number, null, Object],
      default:  ''
    }
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
    word-break:normal;
    display:block;
    white-space:pre-wrap;
    word-wrap : break-word ;
    overflow: hidden ;
    color: #999;
  }
}
</style>
