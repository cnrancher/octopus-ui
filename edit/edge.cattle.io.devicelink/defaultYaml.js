export const extension = {
  mqtt: {
    client: {
      server:          '',
      protocolVersion: 0,
      basicAuth:       {
        username:      '',
        password: ''
      },
      tlsConfig: {
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
      topic: '',
      will:  {
        topic:   '',
        content:  ''
      },
      qos: 1,
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
      parameters: {
        syncInterval: '15s',
        timeout:      '10s'
      },
      properties: [],
      protocol:   { endpoint: '' }
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
      parameters: {
        syncInterval: '15s',
        timeout:      '10s'
      },
      protocol: {
        rtu: {
          workerID:    '',
          endpoint:   '',
          baudRate:   '',
          dataBits:   8,
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
      parameters: {
        syncInterval: '15s',
        timeout:      '10s'
      },
      extension,
      protocol: {
        tcp: {
          workerID:  '',
          endpoint:  '',
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
      parameters: {
        syncInterval: '15s',
        timeout:      '10s'
      },
      protocol: {
        url:       '',
        basicAuth: {
          username: '',
          password:   '',
        },
        tlsConfig: {
          certFilePEMRef: {
            name: '',
            item: ''
          },
          keyFilePEMRef: {
            name: '',
            item: ''
          }
        }
      },
      properties: []
    }
  }
};

export const MQTT_DEVICE = {
  adaptor: {
    node: '',
    name: 'adaptors.edge.cattle.io/mqtt'
  },
  model: {
    apiVersion: 'devices.edge.cattle.io/v1alpha1',
    kind:       'MQTTDevice'
  },
  template:   {
    metadata: { labels: { } },
    spec:     {
      properties: [],
      protocol:   {
        pattern:   'AttributedTopic',
        client:    { server: '' },
        message:   { topic: '' },
        qos:       1,
        retainted: true,
        operator:  {
          read:  '',
          write: ''
        }
      }
    }
  }
};

export const MQTT_DEVICE_MESSAGE = {
  adaptor: {
    node: '',
    name: 'adaptors.edge.cattle.io/mqtt'
  },
  model: {
    apiVersion: 'devices.edge.cattle.io/v1alpha1',
    kind:       'MQTTDevice'
  },
  template:   {
    metadata: { labels: { } },
    spec:     {
      properties: [],
      protocol:   {
        pattern:   'AttributedMessage',
        client:    { server: 'AttributedMessage' },
        message:   { topic: 'cattle.io/octopus/home/status/:path/:operator' },
        qos:       1,
        retainted: true,
        operator:  {
          read:  'status',
          write: 'set'
        }
      }
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
    metadata: { labels: { } },
    spec:     {
      extension,
      protocol:   {},
      properties: []
    }
  }
};
