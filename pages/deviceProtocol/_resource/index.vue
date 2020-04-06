<script>
import LiveDate from '@/components/formatter/LiveDate';

export default {
  components: { LiveDate },

  data() {
    const { dynamicMenu } = this.$store.state;
    return {
      deviceType: dynamicMenu
    };
  },

  methods: {
    handerView(device) {
      device.goToView();
    },
    handerEdit(device) {
      device.viewEditYaml();
    }
  }
};
</script>

<template>
  <el-row :gutter="12">
    <el-col :span="6" v-for="device in deviceType" :key="device.spec.names.kind">
      <el-card shadow="always" class="card">
        <div class="container">
          {{  device.spec.names.kind }}
        </div>
        <div class="desc">
          这是描述
        </div>
        <div class="action">
          <el-button-group>
            <el-button type="primary" @click="handerView(device)">View</el-button>
            <el-button type="primary" @click="handerEdit(device)">Edit</el-button>
          </el-button-group>
          <LiveDate :value="device.metadata.creationTimestamp" />
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.card {
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    height: 160px;
    font-size: 20px;
    background-color: #55595b;
  }

  .desc {
    height: 60px;
    padding: 15px;
  }

  .action {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
