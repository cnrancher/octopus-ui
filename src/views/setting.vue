<template>
  <div class="setting">
    <h1>This is an setting pages</h1>
    <el-table
      :data="list"
      style="width: 100%"
      :default-sort="{prop: 'objectMeta.name', order: 'descending'}"
    >
      <el-table-column
        prop="objectMeta.name"
        label="name"
        sortable
      />
      <el-table-column
        prop="objectMeta.creationTimestamp"
        label="age"
        sortable
      />
    </el-table>
    <h1>count: {{ count }}</h1>
    <h1>乘积: {{ mulCount }}</h1>
    <Button @click="addCount">Add</Button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  Action,
  Mutation,
  Getter,
  State,
} from 'vuex-class';

const namespace = 'setting';

@Component({
  name: 'Setting',
})
export default class Setting extends Vue {
  @Mutation('setting/changeCount') public changeCount!: Function;

  @Getter('setting/mulCount') public mulCount!: number;

  @Action('setting/fetchData') public fetchData!: Function;

  @State('count', { namespace }) public count!: number;

  @State('list', { namespace }) public list!: object;

  addCount(): void {
    this.changeCount();
  }

  created() {
    this.fetchData();
  }
}
</script>
