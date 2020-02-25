<template>
  <el-row type="flex" id="login" align="middle" justify="center">
    <el-col :span="12">
      <div class="grid-content bg-purple">
        <el-container>
          <el-header>
            <div>{{ $t('login.title') }}</div>
          </el-header>
          <el-main>
            <el-form ref="form" label-position="left" :model="loginForm">
              <el-form-item>
                <el-radio-group v-model="loginForm.resource">
                  <el-radio label="Kubeconfig" size="medium"></el-radio>
                  <div class="kubeconfigInfo">
                    {{ $t('login.kubeconfigTip') }}
                  </div>
                  <el-radio label="Token" size="medium"></el-radio>
                  <div class="tokenInfo">
                    {{ $t('login.tokenTip') }}
                  </div>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">{{ $t('login.logIn') }}</el-button>
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
  private loginForm = {
    resource: 'Kubeconfig',
  }

  onSubmit(): void {
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

.kubeconfigInfo, .tokenInfo {
  padding: 10px 0px 20px 20px;
  line-height: 28px;
  font-size: 14px;
}
</style>
