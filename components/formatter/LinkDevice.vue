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
    col: {
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
      const apiVersion = this.row.spec.model.apiVersion;
      const type = this.row.spec.model.kind.toLowerCase();
      // /${encodeURIComponent(this.row.id)}
      // const url = apiVersion.replace(/\/[\d\D]*$/, `.${type}`);
      this.url = `/device-model`;
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
