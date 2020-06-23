<script>
export default {
  props: {
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
      :to="{name: 'c-cluster-resource-createtemplate'}"
      tag="button"
      type="button"
      class="btn bg-primary ml-10"
    >
      添加设备模版
    </nuxt-link>
  </div>
</template>
