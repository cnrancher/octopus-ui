export const BLUE_THOOTH_DEVICE = {
  adaptor: {
    node: '',
    name: 'adaptors.edge.cattle.io/ble'
  },
  model: {
    apiVersion: 'devices.edge.cattle.io/v1alpha1',
    kind:       'BluetoothDevice'
  },
  template: {
    metadata: { labels: { } },
    spec:     {
      name:       '',
      macAddress: '',
      properties: []
    }
  }
};

export const MODBUS_DEVICE_RTU = {
  adaptor: {
    node: '',
    name: 'adaptors.edge.cattle.io/modbus'
  },
  model: {
    apiVersion: 'devices.edge.cattle.io/v1alpha1',
    kind:       'ModbusDevice'
  },
  template: {
    metadata: { labels: {} },
    spec:     {
      protocolConfig: {
        rtu: {
          slaveID:    '',
          serialPort: '',
          baudRate:   '',
          dataBits:   '',
          parity:     '',
          stopBits:   ''
        }
      },
      properties: []
    }
  }
};

export const MODBUS_DEVICE_TCP = {
  adaptor: {
    node: '',
    name: 'adaptors.edge.cattle.io/modbus'
  },
  model: {
    apiVersion: 'devices.edge.cattle.io/v1alpha1',
    kind:       'ModbusDevice'
  },
  template: {
    metadata: { labels: {} },
    spec:     {
      protocolConfig: {
        tcp: {
          slaveID:    '',
          serialPort: '',
          ip:         '',
          port:       ''
        }
      },
      properties: []
    }
  }
};
