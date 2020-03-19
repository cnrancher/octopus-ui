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
    this.findUrl(this.value);
  },
  methods: {
    findUrl() {
      const type = this.row.spec.model.kind.toLowerCase();
      this.url = `/device-model/${type}`;
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
