<script>
export default {
  props: {
    allData: {
      type:     Object,
      required: true
    }
  },
  data() {
    return { };
  },
  computed: {
    noReady() {
      return this.totalReplicas - this.totalReadyReplicas;
    },
    totalReadyReplicas() {
      return this.allData.totalReadyReplicas;
    },
    totalReplicas() {
      return this.allData.totalReplicas;
    },
    num() {
      return this.allData.num;
    }
  }
};
</script>

<template>
  <div class="progress">
    <div class="progress-bar">
      <template v-if="totalReadyReplicas === totalReplicas">
        <span class="bg-success hasRadius"></span>
      </template>

      <template v-else>
        <span v-for="i in noReady" :key="i" class="bg-error" :class="{'hasLeftRadius': i === 1, 'hasMargin hashRightRadius': i === noReady }"></span>
        <span v-for="i in totalReadyReplicas" :key="i" class="bg-success" :class="{'hasLeftRadius': i === 1 && noReady === 0, 'hashRightRadius': i === totalReadyReplicas }"></span>
      </template>
    </div>
    <span class="num">{{ num }}</span>
  </div>
</template>

<style lang="scss" scoped>
.progress {
  display: flex;
  flex-direction: column;

  .progress-bar {
    width: 120px;
    height: 10px;
    display: flex;
    span {
      flex: 1;
      background: red;
    }

    .hasRadius {
      border-radius: 5px;
    }

    .hasLeftRadius {
      border-radius: 5px 0 0 5px;
    }

    .hashRightRadius {
      border-radius: 0 5px 5px 0;
    }

    .bg-success {
      background: green;
    }

    .hasMargin {
      margin-right: 1px;
    }

  }
}

.state {
  width: 120px;
  height: 10px;
  border-radius: 5px;
  margin-right: 10px;
}

.num {
  align-self: center;
}
</style>
