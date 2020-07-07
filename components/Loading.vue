<script>
import SVGA from 'svgaplayerweb';

export default {
  data: () => ({ loading: false }),

  mounted() {
    const player = new SVGA.Player('#demoCanvas');
    const parser = new SVGA.Parser('#demoCanvas');

    parser.load('static/mutiMask.svga', (videoItem) => {
      player.setVideoItem(videoItem);
      player.startAnimation();
    });
  },
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
      <!-- <div id="demoCanvas" class="svga" ref="canvas"></div> -->
      Loading...
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
  }

  .svga {
    width: 200px;
    height: 200px;
    margin: 100px auto;
  }
</style>
