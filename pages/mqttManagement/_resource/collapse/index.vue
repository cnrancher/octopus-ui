<script>
export default {
  data() {
    return {};
  }
};
</script>

<template>
  <div id="collapse">
    <div class="collapse-header">
      <div class="expand">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <div class="title">
        <span class="type">配置选项</span>
        <span class="desc">Helm模版接受逗号做为分隔符的字符串列表</span>
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#collapse {
  .collapse-header {
    cursor: pointer;
    user-select: none;
    background: #f2f5f5;
    border: solid #dde4e6 thin;
    padding: 5px;
    vertical-align: middle;
    width: 100%;
    display: flex;

    .expand {
      margin-right: 10px;
    }

    .title, .expand {
      height: 40px;
      display: flex;
      align-items: center;
    }

    .title {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .type {
        font-size: 15px;
      }
      .desc {
        font-size: 12px;
        color: #8b959c;
      }
    }
  }

  .content {
    border: 1px solid #ccc;
    padding: 15px;
  }
}
</style>
