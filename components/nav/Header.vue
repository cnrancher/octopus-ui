<script>
import Identicon from 'identicon.js';
import { mapState } from 'vuex';
import { NORMAN } from '@/config/types';
import { mapPref, USER_ID } from '@/store/prefs';
import NamespaceFilter from './NamespaceFilter';
import { md5 } from '@/utils/crypto';

export default {
  components: { NamespaceFilter },

  computed: {
    ...mapState(['managementReady', 'clusterReady', 'isRancher', 'isMultiCluster', 'currentCluster']),

    userId: mapPref(USER_ID),

    authEnabled() {
      return this.$store.getters['auth/enabled'];
    },

    principal() {
      return this.$store.getters['rancher/byId'](NORMAN.PRINCIPAL, this.$store.getters['auth/principalId']) || {};
    },

    backToRancherLink() {
      if ( !this.isRancher ) {
        return;
      }

      const cluster = this.$store.getters['currentCluster'];
      let link = '/';

      if ( cluster ) {
        link = `/c/${ escape(cluster.id) }`;
      }

      if ( process.env.dev ) {
        link = `https://localhost:8000${ link }`;
      }

      return link;
    },

  },
  methods: {
    avatarSrc() {
      const id = 'Unknown';

      const hash = md5(id, 'hex');
      const out = `data:image/png;base64,${ new Identicon(hash, 80, 0.01).toString() }`;

      return out;
    },
  }
};
</script>

<template>
  <header :class="{'back-to-rancher': backToRancherLink}">
    <div class="top">
      <NamespaceFilter v-if="clusterReady" />
    </div>

    <div v-if="backToRancherLink" class="back">
      <a v-t="'header.backToRancher'" :href="backToRancherLink" />
    </div>

    <div class="user">
      <v-popover
        placement="bottom"
        offset="-5"
        trigger="hover"
        :delay="{show: 0, hide: 200}"
        :popper-options="{modifiers: { flip: { enabled: false } } }"
      >
        <div class="user-info">
          <img :src="avatarSrc()" width="40" height="40" />
        </div>

        <template slot="popover">
          <ul class="list-unstyled dropdown" style="margin: -1px;">
            <li>
              <div class="pt-5 pb-5">
                {{ userId }}
              </div>
            </li>
            <nuxt-link tag="li" :to="{name: 'prefs'}" class="pt-5 pb-5 hand">
              <a>Preferences <i class="icon icon-fw icon-gear" /></a>
            </nuxt-link>
            <nuxt-link tag="li" :to="{name: 'auth-logout'}" class="pt-5 pb-5 hand">
              <a>Log Out <i class="icon icon-fw icon-close" /></a>
            </nuxt-link>
          </ul>
        </template>
      </v-popover>
    </div>
  </header>
</template>

<style lang="scss" scoped>
  HEADER {
    display: grid;
    height: 100vh;

    grid-template-areas:  "top  top   back user";
    grid-template-columns: var(--nav-width) auto 0px var(--header-height);
    grid-template-rows:    var(--header-height);

    &.back-to-rancher {
      grid-template-columns: var(--nav-width) auto 150px var(--header-height);
    }

    > .top {
      grid-area: top;
      background-color: var(--header-bg);
      padding-top: 8px;

      INPUT[type='search']::placeholder,
      .vs__open-indicator,
      .vs__selected {
        color: white!important;
      }

      .vs__selected {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.25);
      }
      .vs__deselect {
        fill: white;
      }

      .vs__actions {
        background: red!important;
      }

      .filter {
        margin-left: 10px;

        .vs__dropdown-toggle {
          background: var(--header-dropdown);
          border-radius: var(--border-radius);
          border: none;
          margin: 0 35px 0 25px!important;
        }
      }
    }

    > .back {
      grid-area: back;
      background-color: var(--header-bg);

      A {
        line-height: var(--header-height);
        display: block;
        color: white;
        padding: 0 5px;
        margin-right: 20px;
        text-align: right;
      }
    }

    > .user {
      grid-area: user;
      background-color: var(--header-bg);
      padding: 5px;

      .user-info {
        display: flex;
        align-items: center;

        img {
          border-radius: 50%;
        }
      }
    }
  }
</style>
