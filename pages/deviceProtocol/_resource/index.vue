<script>
import LiveDate from '@/components/formatter/LiveDate';
import { deviceDefaultInfo, defaultDevice } from '@/config/map';

export default {
  components: { LiveDate },

  data() {
    const { devicesType } = this.$store.state;
    const language = this.$store.getters['i18n/getLanguage'];

    return {
      devicesType,
      defaultDevice,
      language
    };
  },

  methods: {
    handerEdit(device) {
      device.goToEditYaml();
    },
    defaultImg(kind) {
      const iconUrl = deviceDefaultInfo[kind]?.icon || deviceDefaultInfo.default.icon;

      return require(`static/${ iconUrl }`);
    }
  }
};
</script>

<template>
  <div id="device-protocol" class="p-20">
    <el-row :gutter="12" class="cardModule" type="flex">
      <el-col
        v-for="device in devicesType"
        :key="device.spec.names.kind"
        class="device"
        :xs="24"
        :sm="24"
        :md="12"
        :lg="8"
        :xl="6"
      >
        <el-card shadow="always" class="card">
          <img
            v-real-img="device.metadata.annotations['devices.edge.cattle.io/icon']"
            :src="defaultImg(device.spec.names.kind)"
          />
          <div class="desc">
            <template v-if="language === 'zh-hant' && defaultDevice.includes(device.spec.names.kind)">
              <div v-t="`deviceInfo.${device.spec.names.kind}`"></div>
            </template>

            <template v-else>
              <div>
                {{ device.metadata.annotations['devices.edge.cattle.io/description'] }}
              </div>
            </template>
          </div>
          <div class="action">
            <el-button type="primary" @click="handerEdit(device)">
              查看
            </el-button>
            <LiveDate :value="device.metadata.creationTimestamp" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.cardModule {
  flex-wrap: wrap;

  .device {
    display: flex;
  }

  .card {
    margin-bottom: 18px;

    img {
      height: 130px;
      object-fit: contain
    }

    .desc {
      min-height: 116px;
      line-height: 19px;
      padding: 15px;
      text-indent:2em;
    }

    .action {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    img {
      width: 100%;
    }
  }
}
</style>

<style lang="scss">
#device-protocol {
  .el-card {
    flex: 1;
    min-height: 200px;
    display: flex;
    .el-card__body {
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      .desc {
        flex: 1;
      }
    }
  }
}
</style>
