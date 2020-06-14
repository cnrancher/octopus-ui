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
      extension: {
        mqtt: {
          client: {
            server:          'string',
            protocolVersion: 1,
            will:            {
              topicName:      '$will',
              payloadEncode:  'raw',
              qos:            0,
              payloadContent: '',
              retained:       false
            },
            basicAuth: {
              name:      '',
              passsword: ''
            },
            tlsConfig: {
              caFilePem:          '',
              certFilePem:        '',
              keyFilePem:         '',
              insecureSkipVerify: false
            },
            configBasicAuth: true,
            configTLS:       true,
            cleanSession:    true,
            store:           {
              type:            'memory',
              direcotryPrefix: '/var/run/octopus/mqtt',
            },
            resumeSubs:           true,
            connectTimeout:       'string',
            keepAlive:            'string',
            pingTimeout:          'string',
            order:                true,
            writeTimeout:         'string',
            autoReconnect:        true,
            maxReconnectInterval: 1,
            messageChannelDepth:  1,
            // httpHeaders: "<map[string][]string>"
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
            waitTimeout:   'string'
          }
        }
      },
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
      extension: {
        mqtt: {
          client: {
            server:          'string',
            protocolVersion: 1,
            will:            {
              topicName:      '$will',
              payloadEncode:  'raw',
              qos:            0,
              payloadContent: '',
              retained:       false
            },
            basicAuth: {
              name:      '',
              passsword: ''
            },
            tlsConfig: {
              caFilePem:          '',
              certFilePem:        '',
              keyFilePem:         '',
              insecureSkipVerify: false
            },
            configBasicAuth: true,
            configTLS:       true,
            cleanSession:    true,
            store:           {
              type:            'memory',
              direcotryPrefix: '/var/run/octopus/mqtt',
            },
            resumeSubs:           true,
            connectTimeout:       'string',
            keepAlive:            'string',
            pingTimeout:          'string',
            order:                true,
            writeTimeout:         'string',
            autoReconnect:        true,
            maxReconnectInterval: 1,
            messageChannelDepth:  1,
            // httpHeaders: "<map[string][]string>"
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
            waitTimeout:   'string'
          }
        }
      },
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
  template: {
    metadata: { labels: {} },
    spec:     {
      extension: {
        mqtt: {
          client: {
            server:          'string',
            protocolVersion: 1,
            will:            {
              topicName:      '$will',
              payloadEncode:  'raw',
              qos:            0,
              payloadContent: '',
              retained:       false
            },
            basicAuth: {
              name:      '',
              passsword: ''
            },
            tlsConfig: {
              caFilePem:          '',
              certFilePem:        '',
              keyFilePem:         '',
              insecureSkipVerify: false
            },
            configBasicAuth: true,
            configTLS:       true,
            cleanSession:    true,
            store:           {
              type:            'memory',
              direcotryPrefix: '/var/run/octopus/mqtt',
            },
            resumeSubs:           true,
            connectTimeout:       'string',
            keepAlive:            'string',
            pingTimeout:          'string',
            order:                true,
            writeTimeout:         'string',
            autoReconnect:        true,
            maxReconnectInterval: 1,
            messageChannelDepth:  1,
            // httpHeaders: "<map[string][]string>"
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
            waitTimeout:   'string'
          }
        }
      },
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
  template: {
    metadata: { labels: {} },
    spec:     {
      extension: {
        mqtt: {
          client: {
            server:          'string',
            protocolVersion: 1,
            will:            {
              topicName:      '$will',
              payloadEncode:  'raw',
              qos:            0,
              payloadContent: '',
              retained:       false
            },
            basicAuth: {
              name:      '',
              passsword: ''
            },
            tlsConfig: {
              caFilePem:          '',
              certFilePem:        '',
              keyFilePem:         '',
              insecureSkipVerify: false
            },
            configBasicAuth: true,
            configTLS:       true,
            cleanSession:    true,
            store:           {
              type:            'memory',
              direcotryPrefix: '/var/run/octopus/mqtt',
            },
            resumeSubs:           true,
            connectTimeout:       'string',
            keepAlive:            'string',
            pingTimeout:          'string',
            order:                true,
            writeTimeout:         'string',
            autoReconnect:        true,
            maxReconnectInterval: 1,
            messageChannelDepth:  1,
            // httpHeaders: "<map[string][]string>"
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
            waitTimeout:   'string'
          }
        }
      },
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
  template: {
    metadata: { labels: { wj: '' } },
    spec:     {
      extension: {
        mqtt: {
          client: {
            server:          'string',
            protocolVersion: 1,
            will:            {
              topicName:      '$will',
              payloadEncode:  'raw',
              qos:            0,
              payloadContent: '',
              retained:       false
            },
            basicAuth: {
              name:      '',
              passsword: ''
            },
            tlsConfig: {
              caFilePem:          '',
              certFilePem:        '',
              keyFilePem:         '',
              insecureSkipVerify: false
            },
            configBasicAuth: true,
            configTLS:       true,
            cleanSession:    true,
            store:           {
              type:            'memory',
              direcotryPrefix: '/var/run/octopus/mqtt',
            },
            resumeSubs:           true,
            connectTimeout:       'string',
            keepAlive:            'string',
            pingTimeout:          'string',
            order:                true,
            writeTimeout:         'string',
            autoReconnect:        true,
            maxReconnectInterval: 1,
            messageChannelDepth:  1,
            // httpHeaders: "<map[string][]string>"
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
            waitTimeout:   'string'
          }
        }
      },
      protocol:   {},
      properties: []
    }
  }
};
