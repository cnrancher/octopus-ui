<script>

export default {
  props: {
    properties: {
      type:     Array,
      required: true
    },
    visible: {
      type:     Boolean,
      required: true
    }
  },
  data() {
    return {
      accessMode: [{
        value: 'NotifyOnly',
        label: 'NotifyOnly'
      }, {
        value: 'ReadOnly',
        label: 'ReadOnly'
      }, {
        value: 'ReadWrite',
        label: 'ReadWrite'
      }]
    };
  },
  computed: {
    showModel() {
      return this.visible;
    },
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
    empty-text=" "
    style="width: 100%"
  >
    <el-table-column
      prop="name"
      label="属性名称"
    >
      <template slot-scope="scope">
        <el-input v-model="scope.row.name" disabled></el-input>
      </template>
    </el-table-column>
    <el-table-column
      prop="type"
      label="访问模式"
    >
      <template slot-scope="scope">
        <el-select v-model="scope.row.accessMode" disabled>
          <el-option
            v-for="item in accessMode"
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
      label="描述"
    >
      <template slot-scope="scope">
        <el-input v-model="scope.row.description" disabled></el-input>
      </template>
    </el-table-column>
    <el-table-column
      prop="value"
      label="UUID"
    >
      <template slot-scope="scope">
        <el-input v-model="scope.row.visitor.characteristicUUID" disabled></el-input>
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
