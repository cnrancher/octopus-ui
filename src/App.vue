<template>
  <div id="app">
    <el-row type="flex" align="middle" id="header">
      <el-col :span="2">
        <img src="@/assets/images/logo.svg" class="logo" />
      </el-col>
      <el-col :span="2" :push="20">
        <Language />
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="2">
        <Nav />
      </el-col>
    </el-row>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Language from '@/components/Language.vue';
import Nav from '@/components/Nav.vue';

@Component({
  components: {
    Language,
    Nav,
  },
})
export default class App extends Vue {}
</script>

<style scoped lang="scss">
body {
  margin: 0px;
  padding: 0px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  #header {
    background-color: $app-header;

    .logo {
      width: 55px;
      height: 28px;
    }
  }

}
</style>
