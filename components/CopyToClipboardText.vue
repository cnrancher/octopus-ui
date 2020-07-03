<script>
export default {
  props: {
    text: {
      type:     String,
      required: true,
    },
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
  <a v-tooltip="{'content': copied ? 'Copied!' : 'Click to Copy', hideOnTargetClick: false}" href="#" class="copy" @click.stop.prevent="clicked">
    {{ text }} <i class="icon icon-copy" />
  </a>
</template>
