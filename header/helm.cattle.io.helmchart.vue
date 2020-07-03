<script>
export default {
  props: {
    yamlRoute: {
      type:     String,
      required: true,
    },
  },

  data() {
    return {};
  }
};
</script>

<template>
  <div>
    <nuxt-link
      to="/c/local/edgeapi.cattle.io.catalog"
      tag="button"
      type="button"
      class="btn bg-primary"
    >
      管理
    </nuxt-link>

    <nuxt-link
      :to="{path: yamlRoute}"
      tag="button"
      type="button"
      class="btn bg-primary ml-10"
    >
      Create as Yaml
    </nuxt-link>

    <nuxt-link
      to="/mqttManagement/catalog"
      tag="button"
      type="button"
      class="btn bg-primary ml-10"
    >
      create
    </nuxt-link>
  </div>
</template>
