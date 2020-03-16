<script>
import { USERNAME } from '@/config/cookies';
import LabeledInput from '@/components/form/LabeledInput';
import AsyncButton from '@/components/AsyncButton';
import { LOCAL, LOGGED_OUT, TIMED_OUT, _FLAGGED } from '@/config/query-params';
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
  <main class="login">
    <div class="row">
      <div class="col span-6">
        <h1 class="text-center">
          Welcome to Edge
        </h1>
        <h4 v-if="err" class="text-error text-center">
          An error occurred logging in.  Please try again.
        </h4>
        <h4 v-else-if="loggedOut" class="text-success text-center">
          You have been logged out.
        </h4>
        <h4 v-else-if="timedOut" class="text-error text-center">
          Log in again to continue.
        </h4>

        <form class="mt-50">
          <div class="row">
            <div class="col span-4 offset-4">
              <LabeledInput
                ref="username"
                v-model="username"
                label="Username"
                autocomplete="username"
              />
            </div>
          </div>
          <div class="row">
            <div class="col span-4 offset-4">
              <LabeledInput
                ref="password"
                v-model="password"
                type="password"
                label="Password"
                autocomplete="password"
              />
            </div>
          </div>
          <div class="row">
            <div class="col span-4 offset-4 text-center">
              <AsyncButton
                type="submit"
                action-label="Log In with Local User"
                waiting-label="Logging In..."
                success-label="Logged In"
                error-label="Error"
                @click="loginLocal"
              />
              <div>
                <Checkbox v-model="remember" label="Remember Username" type="checkbox" />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="col span-6 landscape"></div>
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
      background-size: cover;
      background-position: center center;
      height: 100vh;
    }
  }
</style>
