<script>
import { mapGetters } from 'vuex';
import { options } from '@/config/footer';

export default {
  computed: {
    ...mapGetters('i18n', ['selectedLocaleLabel', 'availableLocales']),

    options() {
      return options();
    }
  },

  methods: {
    switchLocale(locale) {
      this.$store.dispatch('i18n/switchTo', locale);
    }
  }
};

</script>

<template>
  <div class="footer">
    <div v-for="(value, name) in options" :key="name">
      <a v-t="name" :href="value" target="_blank" />
    </div>

    <div class="space" />

    <v-popover
      placement="top"
    >
      <a class="hand">
        {{ selectedLocaleLabel }}
      </a>

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
</template>

<style lang="scss" scoped>
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    border-top: solid thin var(--border);

    > DIV {
      line-height: 30px;
      padding: 10px 20px;

      &.space {
        flex-grow: 1;
      }
    }
  }
</style>
