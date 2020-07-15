<script>
import { getVendor, getProduct } from '../../config/private-label';
import { USERNAME } from '@/config/cookies';
import LabeledInput from '@/components/form/LabeledInput';
import AsyncButton from '@/components/AsyncButton';
import { LOGGED_OUT, TIMED_OUT, _FLAGGED } from '@/config/query-params';
import Checkbox from '@/components/form/Checkbox';

export default {
  name:       'Login',
  layout:     'unauthenticated',
  components: {
    LabeledInput, AsyncButton, Checkbox
  },

  data({ $cookies }) {
    const username = $cookies.get(USERNAME, { parseJSON: false }) || '';

    return {
      vendor:  getVendor(),
      product: getProduct(),

      username,
      remember:  !!username,
      password:  '',

      timedOut:  this.$route.query[TIMED_OUT] === _FLAGGED,
      loggedOut: this.$route.query[LOGGED_OUT] === _FLAGGED,
      err:       this.$route.query.err,
    };
  },

  mounted() {
    this.focusSomething();
  },

  methods: {
    focusSomething() {
      let elem;

      if ( this.username ) {
        elem = this.$refs.password;
      } else {
        elem = this.$refs.username;
      }

      if ( elem ) {
        elem.focus();

        if ( elem.select ) {
          elem.select();
        }
      }
    },

    async loginLocal(buttonCb) {
      try {
        this.err = null;
        await this.$store.dispatch('auth/login', {
          body:     {
            username: this.username,
            password: this.password
          }
        });

        if ( this.remember ) {
          this.$cookies.set(USERNAME, this.username, {
            encode: x => x,
            maxAge: 86400 * 365,
            secure: true,
          });
        } else {
          this.$cookies.remove(USERNAME);
        }

        buttonCb(true);
        this.$router.replace('/');
      } catch (err) {
        this.err = err;
        buttonCb(false);
      }
    },
  }
};
</script>

<template>
  <main class="login">
    <div class="row landscape">
      <div class="col span-12">
        <h1 class="text-center">
          {{ vendor }} {{ product }}
        </h1>
        <h4 v-if="err" class="text-error text-center">
          尝试登录时发生错误，请稍后重试。
        </h4>
        <h4 v-else-if="loggedOut" class="text-success text-center">
          您已注销登录。
        </h4>
        <h4 v-else-if="timedOut" class="text-error text-center">
          请重新登录后再重试.
        </h4>

        <form class="mt-50">
          <div class="row">
            <div class="col span-2 offset-5">
              <LabeledInput
                ref="username"
                v-model="username"
                label="用户名"
                autocomplete="username"
              />
            </div>
          </div>
          <div class="row">
            <div class="col span-2 offset-5">
              <LabeledInput
                ref="password"
                v-model="password"
                type="password"
                label="密码"
                autocomplete="password"
              />
            </div>
          </div>
          <div class="row">
            <div class="col span-2 offset-5 text-center">
              <AsyncButton
                type="submit"
                action-label="登录"
                waiting-label="登录中..."
                success-label="登录成功"
                error-label="发生错误"
                @click="loginLocal"
              />
              <div>
                <Checkbox v-model="remember" label="记住" type="checkbox" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
  .login {
    overflow: hidden;

    .row {
      align-items: center;
    }

    .landscape {
      background-image: url('~assets/images/login-landscape.svg');
      background-repeat: no-repeat;
      background-size:100% 125vh;
      height: 100vh;
    }
  }
</style>
