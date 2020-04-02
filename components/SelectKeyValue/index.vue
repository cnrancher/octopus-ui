<script>
const options = [{
  label: 'Add',
  value: 'Add'
}, {
  lable: 'Subtract',
  value: 'Subtract'
}, {
  label: 'Multiply',
  value: 'Multiply'
}, {
  label: 'Divide',
  value: 'Divide'
}];

export default {
  name: 'SelectKeyValue',

  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    const rows = this.value || [];

    return {
      options,
      rows
    };
  },

  methods: {
    add() {
      this.rows.push({
        operationType:   '',
        operationValue:  '',
      });
    },
    remove(idx) {
      this.rows.splice(idx-1, 1)
    },
  }
};
</script>

<template>
  <div>
    <template v-for="(row, idx) in rows">
      <el-row :key="idx" :span="24" type='flex' class="mb-20" justify="space-between">
        <el-col :span="8">
          <el-select v-model="row.operationType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="8">
          <el-input v-model="row.operationValue" placeholder="e.g. 0"></el-input>
        </el-col>

        <el-col :span="6">
          <el-button class="bg-remove" @click="remove(idx)"> Remove </el-button>
        </el-col>
      </el-row>
    </template>
    <el-button type="primary" @click="add">
      添加OrderOfOperation
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
.remove {
  cursor: pointer;
  margin-left: 30px;
}
</style>
