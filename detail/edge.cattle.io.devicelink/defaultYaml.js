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
    metadata: { labels: {} },
    spec:     {
      name:       '',
      macAddress: '',
      properties: [{
        name:        'temperature',
        description: 'Temperature in degree celsius',
        accessMode:  'NotifyOnly',
        type:        {
          int: {
            accessMode: 'Read',
            maximun:    100,
            unit:       'degree celsius'
          }
        },
        visitor: { characteristicUUID: 'UUid' }
      }]
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
          slaveID:    10,
          serialPort: '/dev/ttys008',
          baudRate:   19200,
          dataBits:   8,
          parity:     'E',
          stopBits:   1
        }
      },
      properties: [{
        name:        'temperature-enable',
        description: 'enable data collection of temperature sensor',
        value:       'true',
        dataType:    'boolean',
        readOnly:    'true',
        visitor:     {
          register: 'CoilRegister',
          offset:   2,
          quantity: 1,
        }
      }]
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
          slaveID:    1,
          serialPort: '/dev/ttys008',
          ip:         '192.168.1.3',
          port:       '502'
        }
      },
      properties: [{
        name:        'temperature-enable',
        description: 'enable data collection of temperature sensor',
        value:       'true',
        dataType:    'boolean',
        readOnly:    'true',
        visitor:     {
          register: 'CoilRegister',
          offset:   2,
          quantity: 1,
        }
      }]
    }
  }
};
