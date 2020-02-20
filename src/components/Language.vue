<template>
  <div id="language">
    <el-dropdown @command="handleSelect">
      <span class="el-dropdown-link">
        {{this.language[this.choose]}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(val, key) in language" :key="key" :command="key">
          {{ val }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts" >
import {
  Component,
  Vue,
  Emit,
} from 'vue-property-decorator';

@Component
export default class Nav extends Vue {
  private choose = '';

  private language: Record<string, string> = {
    en: 'English',
    zh: '中文',
  }

  @Emit()
  handleSelect(lang: string): void {
    localStorage.setItem('lang', lang);
    this.$i18n.locale = lang;
    this.choose = lang;
  }

  mounted() {
    this.choose = this.$i18n.locale;
  }
}
</script>

<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
}
</style>
