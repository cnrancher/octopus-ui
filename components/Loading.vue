<script>
export default {
  data: () => ({ loading: false }),

  methods: {
    start() {
      this.loading = true;
    },

    finish() {
      this.loading = false;
    }
  }
};
</script>

<template>
  <div v-if="loading">
    <div class="overlay"></div>
    <div class="content">
      <img class="loading" src="~/assets/images/loading.gif" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .overlay {
    z-index: z-index('loadingOverlay');
    background-color: var(--overlay-bg);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .content {
    position: absolute;
    top: 50vh;
    left: 0;
    right: 0;
    text-align: center;
    z-index: z-index('loadingContent');

    .loading {
      width: 80px;
      height: 80px;
    }
  }

  .svga {
    width: 200px;
    height: 200px;
    margin: 100px auto;
  }
</style>
