<script>
import { NODE } from '@/config/types';
export default {
  props: {
    value: {
      type:     String,
      default: ''
    },
    row: {
      type:     Object,
      required: true
    },
    col: {
      type:     Object,
      required: true
    },
  },
  data() {
    return { url: '' };
  },
  mounted() {
    this.findDevice(this.value);
  },
  methods: {
    findDevice(id) {
      const name = 'device-resource-id';
      const params = {
        resource:  this.row.type,
        namespace: this.row.metadata && this.row.metadata.namespace,
        id:        this.row.id
      };

      this.url = this.$router.resolve({
        name,
        params,
      }).href;
    }
  }
};
</script>

<template>
  <nuxt-link :to="url">
    {{ value }}
  </nuxt-link>
</template>

<style lang="scss" scoped>
span {
  cursor: pointer;
  a:hover {
    text-decoration: underline;
  }
}
</style>
