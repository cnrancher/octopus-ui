import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
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
}]
export default {
  name: 'SelectKeyValue',

  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      options,
      rows: this.value || []
    }
  },
}
</script>

<template>
  <div>
    <template v-for="(row, idx) in rows">
      <el-row :span='24' :key="idx">
        <el-col :span='6'>
          <el-select v-model="row.operationType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span='8'>
          <el-input v-model="row.operationValue" placeholder="e.g. 0"></el-input>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<style lang="scss" scoped>

</style>
