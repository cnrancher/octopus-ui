<template>
  <div id="header">
    <div class="content">
      <div class="left">
        <slot name="name"></slot>
      </div>

      <div class="right">
        <slot name="action"></slot>
      </div>
    </div>

    <el-divider></el-divider>
  </div>
</template>

<style lang="scss" scoped>
#header {

  .content {
    display: flex;
    align-items: center;

    .left {
      flex: 1;
      font-size: 15px;
      font-weight: 500;
    }

    .right {
      display: flex;
    }
  }

}
</style>
