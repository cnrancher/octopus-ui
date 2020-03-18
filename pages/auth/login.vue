<script>
/* eslint-disable */
import { mapGetters } from 'vuex';
import { USERNAME } from '@/config/cookies';
import AsyncButton from '@/components/AsyncButton';
import { LOCAL, LOGGED_OUT, TIMED_OUT, _FLAGGED } from '@/config/query-params';

export default {
  name:       'Login',
  layout:     'unauthenticated',
  components: {
    AsyncButton
  },

  data({ $cookies }) {
    const username = $cookies.get(USERNAME, { parseJSON: false }) || '';

    return {
      username,
      remember:  !!username,
      password:  '',

      timedOut:  this.$route.query[TIMED_OUT] === _FLAGGED,
      loggedOut: this.$route.query[LOGGED_OUT] === _FLAGGED,
      err:       this.$route.query.err,
    };
  },
  computed: {
    ...mapGetters('i18n', ['selectedLocaleLabel', 'availableLocales']),

    options() {
      return options();
    }
  },
  mounted() {
    this.focusSomething();
  },

  methods: {
    switchLocale(locale) {
      this.$store.dispatch('i18n/switchTo', locale);
    },
    toggleLocal() {
      this.showLocal = true;
      this.$router.applyQuery({ [LOCAL]: _FLAGGED });

      this.$nextTick(() => {
        this.focusSomething();
      });
    },

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

    loginLocal(buttonCb) {
      try {
        this.err = null;

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
  <el-row type="flex" class="login" justify="center" align="middle">
    <el-col :span="8" class="login-box">
      <h1 class="title">您好 <br/>欢迎您使用Octopus</h1>
      <div class="language">
        <v-popover
          placement="bottom"
        >
          <div class="hand select">
            <img src='~assets/images/earth.svg' class="earth" />
            <span>{{ selectedLocaleLabel }}</span>
            <i class="el-icon-arrow-down"></i>
          </div>

          <template slot="popover">
            <ul class="list-unstyled dropdown" style="margin: -1px;">
              <li
                v-for="(value, name) in availableLocales"
                :key="name"
                class="p-10 hand"
                v-close-popover
                @click="switchLocale(name)"
              >
                {{ value }}
              </li>
            </ul>
          </template>
        </v-popover>
      </div>
      <el-col :span="14" push="5">
        <form>
          <div class="username">
            <span>用户名</span>
            <span>记住<el-checkbox size="medium" v-model="remember"  class="remember"></el-checkbox></span>
          </div>
          <el-input v-model="username" size="medium" placeholder="请输入用户名" autocomplete="username" />
          <div class="password">
            <div class="label">密码</div>
            <el-input size="medium" v-model="password" placeholder="请输入密码" autocomplete="password" />
          </div>
          <AsyncButton
            type="submit"
            action-label="登录"
            waiting-label="Logging In..."
            success-label="Logged In"
            error-label="Error"
            @click="loginLocal"
          />
        </form>
      </el-col>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
  .login {
    overflow: hidden;
    width: 100vw;
    background-image: url('~assets/images/login-landscape.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    height: 100vh;

    .login-box {
      background-color: #fff;
      align-items: center;
      padding-top: 6vh;
      padding-bottom: 4vh;
      

      .title {
        text-align: center;
        font-size: 34px;
        line-height: 36px;
      }

      .language {
        margin-top: 4vh;
        margin-bottom: 6vh;
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;

        .select {
          display: flex;
          justify-content: center;
          color: #2088ce;

          span {
            margin: 0 10px;
          }

          .earth, .up {
            width: 20px;
            height: 20px;
          }
        }
      }

      form {
        width: 100%;
        margin: 0 auto;
        color: #acb4b7;
        font-size: 18px;
        display: flex;
        flex-direction: column;

        .username {
          margin-bottom: 1vh;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .remember {
            margin: 0 9px;
          }
        }

        .password {
          margin-bottom: 4.5vh;
          .label {
            margin-top: 3vh;
            margin-bottom: 1.5vh;
          }
        }
      }
    }
  }
</style>
