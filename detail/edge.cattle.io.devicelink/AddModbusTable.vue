<script>
export default {
  props: ['properties', 'visible'],
  data() {
    return {
      typeOption: [{
        value: 'string',
        label: 'string'
      }, {
        value: 'int',
        label: 'int'
      }, {
        value: 'float',
        label: 'float'
      }, {
        value: 'boolean',
        label: 'boolean'
      }]
    };
  },
  computed: {
    showModel() {
      return this.visible
    }
  },
  methods: {
    deleteRow(index, rows) {
      this.$emit('deleteRow', index);
    },
    editRow(index, rows) {
      this.$emit('editRow', index);
    }
  }
};
</script>

<template>
  <el-table
    :data="properties"
    style="width: 100%"
  >
    <el-table-column
      prop="name"
      label="属性名"
    >
      <template slot-scope="scope">
        <el-input v-model="scope.row.name" disabled></el-input>
      </template>
    </el-table-column>
    <el-table-column
      prop="type"
      label="类型"
    >
      <template slot-scope="scope">
        <el-select v-model="scope.row.dataType" disabled>
          <el-option
            v-for="item in typeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column
      prop="value"
      label="属性值"
    >
      <template slot-scope="scope">
        <el-input v-model="scope.row.value" disabled></el-input>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="100"
    >
      <template slot-scope="scope">
        <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index, properties)">
          编辑
        </el-button>
        <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, properties)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
