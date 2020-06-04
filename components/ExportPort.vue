<script>
export default {
  props: {
    list: {
      type:     Array,
      required: true
    }
  },
  data() {
    return { url: document.domain };
  }
};
</script>

<template>
  <div id="export-port">
    <a v-for="(item, index) in list" :key="index" class="list" :href="item.type === 'https' ? 'https://': 'http://' + url + ':' + item.port" target="_blank">{{ item.port }}/{{ item.type }}</a>
  </div>
</template>

<style lang="scss" scoped>
#export-port {
  height: 20px;
  font-size: 16px;

  a {
    margin-left: 10px;
    font-size: 13px;
  }
}
</style>
