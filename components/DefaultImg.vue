<script>
export default {
  props: { real: { type: String } },

  methods: {
    defaultImg() {
      return require(`static/device-default.png`);
    },
  },
};
</script>

<template>
  <img v-real-img="real" :src="defaultImg()" />
</template>

<style lang="scss" scoped>

</style>
