<script>
export default {
  data() {
    return { visible: false };
  },
  methods: {
    setting() {
      this.visible = false;
    },

    logout() {
      this.$router.push('/auth/login');
      this.visible = false;
    }
  }
};
</script>

<template>
  <el-popover v-model="visible">
    <div slot="reference" class="login-info">
      <img src="~/assets/images/people.png" class="people" alt="people">
      <span class="name">jian@rancher</span>
      <i class="el-icon-caret-bottom"></i>
    </div>

    <div>
      <div class="login-info pop">
        <img src="~/assets/images/people.png" class="people" alt="people">
        <span class="name">jian@rancher</span>
      </div>
      <el-divider></el-divider>
      <div class="action">
        <span class="hand set" @click="setting">设定</span>
        <el-divider direction="vertical" class="line"></el-divider>
        <span class="hand" @click="logout">注销</span>
      </div>
    </div>
  </el-popover>
</template>

<style lang="scss" scoped>
.login-info {
  display: flex;
  align-items: center;
  margin: 0 24px 0 0;
  cursor: pointer;

  .people {
    width: 48px;
    height: 48px;
  }

  .name {
    margin: 0 10px 0 15px;
    font-size: 16px;
    color: #fff;
  }

  i {
    color: #fff;
    font-size: 28px;
  }

  &.pop {
    .name {
      color: #6c6c6c;
      font-size: 14px;
    }
  }
}
.action {
  display: flex;
  align-items: center;
  .set {
    color: #5765f1;
  }
  span {
    flex: 1;
    text-align: center;
    font-size: 18px;
  }
}
</style>
