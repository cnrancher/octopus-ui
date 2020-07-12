<script>
import { getObjectFlatterChainData } from '@/utils/object';
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
      let out = [];
      const deviceValue = this.device[0]?.status?.properties || this.device[0]?.status;

      if (Array.isArray(deviceValue)) {
        out = deviceValue.map( (O) => {
          return { [O.name]: O.value };
        });
      } else if (typeof deviceValue === 'object') {
        out = getObjectFlatterChainData(deviceValue, []);
      }

      return out.slice(0, 5);
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
    <template v-for="tag in tagValue">
      <el-tag v-for="(v,k) in tag" :key="k">
        {{ `${k}: ${v}` }}
      </el-tag>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.label {
  span {
    margin-right: 10px;
  }
}
</style>
