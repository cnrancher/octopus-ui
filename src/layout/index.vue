<template>
  <div>
    <v-header />
    <el-row>
      <el-col :span="2">
        <v-nav />
      </el-col>
      <el-col :span="18">
        <router-view />
      </el-col>
    </el-row>

  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Nav from './component/nav.vue';
import Header from './component/header.vue';

@Component({
  components: {
    'v-header': Header,
    'v-nav': Nav,
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
