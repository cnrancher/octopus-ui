<script>
export default {
  props: {
    text: {
      type:     String,
      required: true,
    },
    useIcon: {
      type:     Boolean,
      required: false
    }
  },

  data() {
    return { copied: false };
  },

  methods: {
    clicked($event) {
      $event.stopPropagation();
      $event.preventDefault();

      this.$copyText(this.text).then(() => {
        this.copied = true;

        setTimeout(() => {
          this.copied = false;
        }, 2000);
      });
    },
  }
};
</script>

<template>
  <el-popover
    trigger="hover"
    placement="top"
    :content="copied ? '已复制' : '复制到剪贴板'"
    popper-class="copy-tooltip"
  >
    <a v-if="useIcon" slot="reference" href="#" class="copy-icon" @click="clicked">
      {{ text }} <i class="icon icon-copy" />
    </a>
    <span v-else slot="reference" class="copy" @click="clicked">{{ text }}</span>
  </el-popover>
</template>

<style lang="scss">
  .copy-tooltip {
    text-align: center;
    padding: 5px;
    margin-bottom: 5px!important;
    background: rgba(69,69,69,.8);
    color: var(--nav-bg)!important;
    border: none!important;
    .popper__arrow::after {
      border-top-color: rgba(69,69,69,.8)!important;
    }
  }
</style>
<style lang="scss" scoped>
  .copy-icon {
    color: var(--detail-top-label)!important;
  }
  .copy {
    cursor: pointer;
  }
</style>
