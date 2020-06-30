export const extension = {
  mqtt: {
    client: {
      server:          '',
      will:            {
        topicName:      '',
        payloadEncode:  'raw',
        qos:            0,
        payloadContent: '',
        retained:       false
      },
      basicAuth: {
        name:      '',
        password: ''
      },
      tlsConfig: {
        caFilePem:          '',
        certFilePem:        '',
        keyFilePem:         '',
        insecureSkipVerify: false,
        serverName:         '',
        caFilePEMRef:       {
          item: '',
          name: ''
        },
        certFilePEMRef: {
          item: '',
          name: ''
        },
        keyFilePEMRef: {
          item: '',
          name: ''
        }
      },
      store:           {
        type:            'memory',
        direcotryPrefix: '/var/run/octopus/mqtt',
      },
    },
    message: {
      topic: {
        name:   '',
        prefix: '',
        with:   'nn'
      },
      topicName:     '',
      payloadEncode: 'raw',
      qos:           0,
      retained:      true,
    }
  }
};

export const BLUE_THOOTH_DEVICE = {
  adaptor: {
    node: '',
    name: 'adaptors.edge.cattle.io/ble'
  },
  model: {
    apiVersion: 'devices.edge.cattle.io/v1alpha1',
    kind:       'BluetoothDevice'
  },
  references: [],
  template:   {
    metadata: { labels: { } },
    spec:     {
      extension,
      properties: [],
      protocol:   {
        name:       '',
        macAddress: ''
      }
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
  references: [],
  template:   {
    metadata: { labels: {} },
    spec:     {
      extension,
      protocol: {
        rtu: {
          slaveID:    '',
          serialPort: '',
          baudRate:   '',
          dataBits:   '8',
          parity:     'E',
          stopBits:   1
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
  references: [],
  template:   {
    metadata: { labels: {} },
    spec:     {
      extension,
      protocol: {
        tcp: {
          slaveID:    '',
          ip:         '',
          port:       ''
        }
      },
      properties: []
    }
  }
};

export const OPC_UA_DEVICE = {
  adaptor: {
    node: '',
    name: 'adaptors.edge.cattle.io/opcua'
  },
  model: {
    apiVersion: 'devices.edge.cattle.io/v1alpha1',
    kind:       'OPCUADevice'
  },
  references: [],
  template:   {
    metadata: { labels: {} },
    spec:     {
      extension,
      protocol: {
        url:      '',
        username: '',
        password:   '',
      },
      properties: []
    }
  }
};

export const customDevice = {
  adaptor: {
    node: '',
    name: ''
  },
  model: {
    apiVersion: 'devices.edge.cattle.io/v1alpha1',
    kind:       ''
  },
  references: [],
  template:   {
    metadata: { labels: { wj: '' } },
    spec:     {
      extension,
      protocol:   {},
      properties: []
    }
  }
};
