<script>

export default {
  props: {
    value: {
      type:     [Array, String],
      default: null,
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
    return { url: document.domain };
  },

  computed: {
    port() {
      const ports = this.row.spec.ports || [];
      const out = [];

      if (this.row.spec.type !== 'ClusterIP') {
        for (const P of ports) {
          out.push({
            port:     this.row.spec.type === 'NodePort' ? P.nodePort : P.port,
            protocol: P.protocol
          });
        }
      }

      return out;
    }
  },
};
</script>

<template>
  <span>
    <a v-for="(item, index) in port" :key="index" :href="item.type === 'https' ? 'https://': 'http://' + url + ':' + item.port" target="_blank" rel="nofollow noopener noreferrer">
      <span>{{ item.port }}/</span>{{ item.protocol }}
    </a>
  </span>
</template>
