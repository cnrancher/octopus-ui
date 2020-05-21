<script>
export default {
  props: {
    type: {
      type:    String,
      default: 'Success'
    }
  }
};
</script>

<template>
  <div>
    <div class="bar" :class="type"></div>
  </div>
</template>

<style lang="scss" scoped>
.bar {
  width: 120px;
  height: 10px;
  border-radius: 5px;
  margin-left: auto;
  margin-right: 10px;
}

.Success {
  background-color: green;
}

.Error {
  background-color: red;
}
</style>
