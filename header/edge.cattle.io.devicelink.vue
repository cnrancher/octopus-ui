<script>
export default {
  props: {
    yamlRoute: {
      type:     String,
      required: true,
    },

    formRoute: {
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
      :to="{path: yamlRoute}"
      tag="button"
      type="button"
      class="btn bg-primary"
    >
      导入设备YAML
    </nuxt-link>

    <nuxt-link
      :to="{path: formRoute}"
      tag="button"
      type="button"
      class="btn bg-primary ml-10"
    >
      添加设备
    </nuxt-link>

    <nuxt-link
      to="/c/local/template"
      tag="button"
      type="button"
      class="btn bg-primary ml-10"
    >
      添加设备模板
    </nuxt-link>
  </div>
</template>
