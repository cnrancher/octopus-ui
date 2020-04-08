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

    if (!this.row.spec) {
      return {
        deviceValue: []
      }
    }
    const deviceType = this.row.spec.model.kind.toLowerCase();
    const { name } = this.row.metadata;
    const { list } = this.$store.state.deviceModel.types[deviceType] || [];

    list.forEach((crd) => {
      if (crd.metadata.name === name) {
        deviceValue = crd.status?.properties?.[0];
      }
    });

    return { deviceValue: deviceValue || [] };
  },
};
</script>

<template>
  <div class="label">
    <el-tag v-for="(v,k) in deviceValue" :key="k">
      {{ k }}:{{ v }}
    </el-tag>
  </div>
</template>

<style lang="scss" scoped>
.label {
  span {
    margin-right: 10px;
  }
}
</style>
