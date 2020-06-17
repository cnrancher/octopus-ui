<script>
export default {
  data() {
    return {}
  }
}
</script>

<template>
  <div>
    <nuxt-link
      :to="{name: 'c-cluster-resource-createprotocol'}"
      tag="button"
      type="button"
      class="btn bg-primary ml-10"
    >
      Create from YAML
    </nuxt-link>
  </div>
</template>
