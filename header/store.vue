<script>
export default {
  props: {
    yamlRoute: {
      type:     String,
      required: true,
    },
  },

  data() {
    return {
      mapPath: {
        storageclass:     'storage.k8s.io.storageclass/local-path?mode=edit&as-yaml',
        persistentvolume: 'persistentvolume/create?as-yaml',
      }
    };
  },

  computed: {
    path() {
      return this.$route.query.type || 'storageclass';
    }
  }
};
</script>

<template>
  <div>
    <nuxt-link
      :to="mapPath[path]"
      tag="button"
      type="button"
      class="btn bg-primary"
    >
      Create as Yaml
    </nuxt-link>
  </div>
</template>
