<template>
  <div>
    <el-row type="flex" align="middle" id="header">
      <el-col :span="2">
        <img src="@/assets/images/logo.svg" class="logo" />
      </el-col>
      <el-col :span="2" :push="20">
        <Language />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Language from '@/components/Language.vue';

@Component({
  components: {
    Language,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss" scoped>
  #header {
    background-color: $app-header;

    .logo {
      width: 55px;
      height: 28px;
    }
  }
</style>
