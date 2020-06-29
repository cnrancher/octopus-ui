<script>
import Footer from '@/components/form/Footer';
import LabeledInput from '@/components/form/LabeledInput';
import CreateEditView from '@/mixins/create-edit-view';
import NameNsDescription from '@/components/form/NameNsDescription';

export default {
  name: 'EditCatalog',

  components: {
    Footer, LabeledInput, NameNsDescription
  },

  mixins: [CreateEditView],

  props: {
    value: {
      type:     Object,
      required: true,
    },
  },

  data() {
    let spec = this.value.spec;

    if ( !spec ) {
      spec = { url: '' };
      this.value.spec = spec;
    }

    return {};
  },
};
</script>

<template>
  <div class="catalog">
    <form>
      <slot :value="value" name="top">
        <NameNsDescription :value="value" :mode="mode" :extra-columns="['type']">
          <template v-slot:type>
            <LabeledInput v-model="value.spec.url" label="Url" :mode="mode" />
          </template>
        </NameNsDescription>
      </slot>
    </form>
    <Footer :mode="mode" :errors="errors" @save="save" @done="done" />
  </div>
</template>

<style lang="scss" scoped>
</style>
