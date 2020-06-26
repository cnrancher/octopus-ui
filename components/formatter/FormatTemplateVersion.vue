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
    return { templateList: [] };
  },

  computed: {
    defaultTemplate() {
      const template = this.templateList.filter( (T) => {
        return T.metadata.name === this.row.spec.deviceTemplateName;
      });

      return template?.[0]?.spec.defaultRevisionName;
    }
  },

  methods: {
    async loadDeps() {
      const templateList = await this.$store.dispatch('management/findAll', { type: 'edgeapi.cattle.io.devicetemplate' });

      this.templateList = templateList;
    },
  }
};
</script>

<template>
  <div class="label">
    <template v-if="defaultTemplate === row.id">
      <i class="el-icon-check"></i>
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
