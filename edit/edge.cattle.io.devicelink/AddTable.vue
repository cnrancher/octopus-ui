<script>
import { get } from '@/utils/object';
export default {
  props: {
    properties: {
      type:     Array,
      required: true
    },
    headers: {
      type:     Array,
      required: true
    }
  },

  data() {
    return {};
  },

  methods: {
    deleteRow(index, rows) {
      this.$emit('deleteRow', index);
    },
    editRow(index, rows) {
      this.$emit('editRow', index);
    },
    valueFor(scope, header) {
      const expr = header.value;

      return get(scope.row, expr);
    }
  }
};
</script>

<template>
  <el-table
    :data="properties"
    empty-text=" "
    style="width: 100%"
  >
    <template v-for="header in headers">
      <el-table-column
        :key="header.name"
        :prop="header.name"
        :label="header.label"
      >
        <template slot-scope="scope">
          <el-input :value="valueFor(scope, header)" disabled></el-input>
        </template>
      </el-table-column>
    </template>

    <el-table-column
      fixed="right"
      label="操作"
      width="100"
    >
      <template slot-scope="scope">
        <el-button type="text" @click.native.prevent="editRow(scope.$index, properties)">
          编辑
        </el-button>
        <el-button type="text" @click.native.prevent="deleteRow(scope.$index, properties)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
