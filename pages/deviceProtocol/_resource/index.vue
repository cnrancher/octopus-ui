<script>
import LiveDate from '@/components/formatter/LiveDate';

export default {
  components: { LiveDate },

  data() {
    const { dynamicMenu } = this.$store.state;

    return { deviceType: dynamicMenu };
  },

  methods: {
    handerView(device) {
      device.goToView();
    },
    handerEdit(device) {
      device.viewEditYaml();
    }
  }
};
</script>

<template>
  <el-row :gutter="12">
    <el-col v-for="device in deviceType" :key="device.spec.names.kind" :span="6">
      <el-card shadow="always" class="card">
        <div class="container">
          <template v-if="device.spec.names.kind === 'BluetoothDevice'">
            <img src="~assets/images/Bluetooth_Smart_Logo.svg">
          </template>
          <template v-if="device.spec.names.kind === 'ModbusDevice'">
            <img src="~assets/images/modbus.svg">
          </template>
          <template v-if="device.spec.names.kind === 'OPC_UADevice'">
            <img src="~assets/images/opc-ua.svg">
          </template>
        </div>
        <div class="desc">
          <template v-if="device.spec.names.kind === 'BluetoothDevice'">
            BLE代表低功耗蓝牙（Bluetooth Low Energy，通常描述为Bluetooth 智能设备）。 
            BLE是一种专为短距离通信而设计的无线通信形式。 
            BLE 适配器定义了BLE协议的访问配置与设备属性参数，点击查看详情。
          </template>
          <template v-if="device.spec.names.kind === 'ModbusDevice'">
            Modbus是Modicon系统开发的通信协议。 简而言之，它是一种用于在电子设备之间通过串行线路传输信息的方法。 
            Modbus协议是一个主从架构的协议，Modbus适配器可以被称为Modbus主站，负责连接和采集Modbus从站（设备）的信息。
          </template>
          <template v-if="device.spec.names.kind === 'OPC_UADevice'">
            {{ device.spec.names.kind }}
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
</template>

<style lang="scss" scoped>
.card {
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    height: 160px;
    font-size: 20px;
  }

  .desc {
    height: 116px;
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
</style>
