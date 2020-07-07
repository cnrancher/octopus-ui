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
      device:     [],
      type,
    };
  },

  computed: {
    tagValue() {
      const out = [];
      const deviceValue = this.device[0]?.status?.properties || [this.device[0]?.status];

      for (let i = 0; i < deviceValue?.length; i++) {
        if (typeof deviceValue[i] === 'object') {
          out.push( `${ deviceValue[i]['name'] }: ${ deviceValue[i].value }` );
        }
      }

      return out;
    }
  },
  watch: {
    deviceList: {
      handler(newName, oldName) {
        this.device = this.deviceList.filter( item => item.id === this.row.id);
      },
      immediate: true,
      deep:      true
    }
  },

  methods: {
    async loadDeps() {
      const { type } = this;
      const deviceList = await this.$store.dispatch('management/findAll', { type });

      this.deviceList = deviceList;
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
