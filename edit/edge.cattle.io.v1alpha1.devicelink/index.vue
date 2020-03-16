<script>
import omit from 'lodash/omit';
import { get } from '@/utils/object';

import createEditView from '@/mixins/create-edit-view';
import LabeledInput from '@/components/form/LabeledInput';
import Footer from '@/components/form/Footer';
import { DESCRIPTION } from '@/config/labels-annotations';

export default {
  components: {
    LabeledInput, Footer,
  },
  mixins:     [createEditView],
  data() {
    let description;

    if (!!this.originalValue) {
      const originalAnnotations = get(this.originalValue, 'metadata.annotations');
      if (originalAnnotations) {
        description = originalAnnotations[DESCRIPTION];
      }

      this.value.metadata.annotations = this.originalValue.metadata.annotations ? JSON.parse(JSON.stringify(this.originalValue.metadata.annotations)) : {};
      this.value.metadata.labels = this.originalValue.metadata.labels ? JSON.parse(JSON.stringify(this.originalValue.metadata.labels)) : {};
    }
    if (!this.value.metadata) {
      this.value.metadata = {
        annotations: {},
        labels:      {},
        name:        ''
      };
    }

    if (!this.value.metadata.annotations) {
      this.value.metadata.annotations = {};
    }

    if (!this.value.metadata.labels) {
      this.value.metadata.labels = {};
    }

    return {
      description,
      name: this.value.metadata.name,
    };
  },
  computed: {
    chart: {
      get() {
        return get(this.value.spec, 'chart');
      },
      set(neu) {
        this.$set(this.value.spec, 'chart', neu);
      }
    },
  },
  watch: {
    description(description) {
      this.value.metadata.annotations[DESCRIPTION] = description;
    },
    name(name) {
      this.value.metadata.name = name;
    },
    chart(chart) {
      this.value.spec.chart = chart;
    }
  }
};
</script>

<template>
  <div>
    <form>
      <div class="row">
        <div class="col span-6">
          <LabeledInput
            v-model="name"
            required
            label="Name"
            type="text"
            :disabled="mode!=='create'"
            :mode="mode"
          />
        </div>
      </div>
      <div class="row">
        <div class="col span-6">
          <LabeledInput
            v-model="chart"
            label="chart"
            type="text"
            :mode="mode"
          />
        </div>
      </div>
      <Footer :mode="mode" :errors="errors" @save="save" @done="done" />
    </form>
  </div>
</template>
