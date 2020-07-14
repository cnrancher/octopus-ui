<script>
import { _VIEW } from '@/config/query-params';
import AsyncButton from '@/components/AsyncButton';

export default {
  components: { AsyncButton },

  props: {
    /**
     * Current mode of the page
     * passed to asyncButton to determine lables of the button
     */
    mode: {
      type:     String,
      required: true,
    },

    errors: {
      type:    Array,
      default: null,
    },
  },

  computed: {
    isView() {
      return this.mode === _VIEW;
    },
  },

  methods: {
    save(buttonCb) {
      this.$emit('save', buttonCb);
    },

    done() {
      this.$emit('done');
    },

    formatErrorInfo(error) {
      if (error && error.message) {
        return error.message;
      }

      return error;
    }
  }
};
</script>
<template>
  <div>
    <div class="spacer"></div>

    <div v-for="(err,idx) in errors" :key="idx">
      <div class="text-error">
        {{ formatErrorInfo(err) }}
      </div>
    </div>
    <div class="spacer"></div>
    <div class="text-center">
      <slot name="left" />
      <slot name="cancel">
        <button type="button" class="btn role-secondary" @click="done" @dblclick.stop.prevent>
          <t k="generic.cancel" />
        </button>
      </slot>
      <slot name="middle" />
      <slot name="save">
        <AsyncButton
          v-if="!isView"
          :mode="mode"
          :delay="2000"
          @click="save"
        />
      </slot>
      <slot name="right" />
    </div>
  </div>
</template>
