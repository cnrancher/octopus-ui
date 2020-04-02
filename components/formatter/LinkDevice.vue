<script>
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
  },
  data() {
    return { url: '' };
  },
  mounted() {
    this.findUrl();
  },
  methods: {
    findUrl() {
      // const type = this.row.spec.model.kind.toLowerCase();
      // console.log(this.value, this.row, 'this.row', type, this.row.spec)

      this.url = `/device-model/${ this.value }`;
    }
  }
};
</script>

<template>
  <span>
    <nuxt-link :to="url">
      {{ value }}
    </nuxt-link>
  </span>
</template>
