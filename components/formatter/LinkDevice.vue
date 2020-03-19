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
      const url = apiVersion.replace(/\/[\d\D]*$/, `.${type}/${encodeURIComponent(this.row.id)}`);
      this.url = `/device/${url}`;
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
