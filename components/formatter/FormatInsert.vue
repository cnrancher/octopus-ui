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
    let deviceValue = null;
    const deviceType = this.row.spec.model.kind.toLowerCase();
    const { name, namespace } = this.row.metadata;
    const url = `devices.edge.cattle.io.${deviceType}/${namespace}/${name}`;
    const type = `devices.edge.cattle.io.${deviceType}`;
    const { list } = this.$store.state.deviceModel.types[deviceType] || [];
    console.log(list, 'list')
    // list.forEach(crd => {
    //   if (crd.metadata.name === name) {
    //     deviceValue = crd.
    //   }
    // });
    return {
      deviceValue: null
    };
  },
};
</script>

<template>
  <span v-html="value">
  </span>
</template>
