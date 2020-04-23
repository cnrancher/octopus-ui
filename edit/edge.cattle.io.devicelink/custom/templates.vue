<script>
export default {
  props: {
    templateProtocol: {
      type: Object,
      default: () => {

      }
    }
  },
  data() {
    console.log('------templateProtocol', this.templateProtocol)
    return {
      properties: {
        a: 1,
        b: 2, 
        c: {
          d: 5
        }
      }
    }
  },
  method: {
    isRequired(key) {
      const requiredArr = this.templateProtocol.required || [];
      return requiredArr.includes(key);
    },
    formatProperties() {
      const { properties } = this.templateProtocol;
    }
  }
}
</script>

<template>
  <div>
    <el-col :span="12">
      <el-form-item label="SlaveID">
        <el-input value="123"></el-input>
      </el-form-item>
    </el-col>
  </div>
</template>

<style lang="scss" scoped>

</style>
