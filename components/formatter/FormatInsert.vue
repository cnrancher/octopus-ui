<script>
import LoadDeps from '@/mixins/load-deps';

export default {

  mixins:     [LoadDeps],
  props:  {
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
    const { spec: { model: { kind } } } = this.row;
    const type = `devices.edge.cattle.io.${ kind.toLowerCase() }`;

    return {
      deviceList: [],
      type
    };
  },

  computed: {
    deviceValue() {
      return this.deviceList[0]?.status?.properties;
    },
    tagValue() {
      const out = [];

      for (let i = 0; i < this.deviceValue?.length; i++) {
        if (typeof this.deviceValue[i] === 'object') {
          out.push( `${ this.deviceValue[i]['name'] }: ${ this.deviceValue[i].value }` );
        }
      }

      return out;
    }
  },

  methods: {
    async loadDeps() {
      const { type } = this;
      const deviceList = await this.$store.dispatch('management/findAll', { type });

      this.deviceList = deviceList.filter( item => item.id === this.row.id);
    },
  }
};
</script>

<template>
  <div class="label">
    <el-tag v-for="(v,k) in tagValue" :key="k">
      {{ v }}
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
