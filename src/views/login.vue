<template>
  <el-row type="flex" id="login" align="middle" justify="center">
    <el-col :span="12">
      <div class="grid-content bg-purple">
        <el-container>
          <el-header>
            <div>Rancher Edge 仪表盘</div>
          </el-header>
          <el-main>
            <el-form ref="form" label-position="left" :model="form">
              <el-form-item>
                <el-radio-group v-model="form.resource">
                  <el-radio label="Kubeconfig" size="medium"></el-radio>
                  <div class="kubeconfigInfo">
                    请选择您创建的kubeconfig文件以配置对集群的访问权限。 要了解有关如何配置和使用kubeconfig文件的更多信息，
                    请参阅Configure Access to Multiple Clusters 部分.
                  </div>
                  <el-radio label="Token" size="medium"></el-radio>
                  <div class="kubeconfigInfo">
                    每个 Service Account 都有一个 valid Bearer Token ，可用于登录 Dashboard 。
                    要了解有关如何配置和使用 Bearer Tokens 的更多信息，请参阅 Authentication 部分.
                  </div>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">登录</el-button>
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Login extends Vue {
  private form: object = {
    resource: 'Kubeconfig',
  }

  onSubmit(): void {
    console.log('login success', this.form);
    this.$router.push('/setting');
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common/var.scss";
#login{
  height: 100%;
}
.el-header{
  background-color: $login-header;
  height: 44px !important;
  line-height: 44px;
  font-size: 20px;
  color: $login-header-color;
  text-align: left;
}
.el-main {
  text-align: left;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.el-radio-group {
  width: 100%;
}

.kubeconfigInfo {
  padding: 10px 0px 20px 20px;
  line-height: 28px;
  font-size: 14px;
}
</style>
