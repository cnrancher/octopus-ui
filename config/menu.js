export const MENUS = [
  {
    name: 'global-overview',
    path: '/global-overview',
    meta: {
      title: '全局概览',
      icon:  require('~/assets/images/global-resource.png'),
    }
  },
  {
    name: 'infrastructure',
    meta: {
      title: '基础设施',
      icon:  require('~/assets/images/infrastructure.png'),
    },
    children: [
      {
        path: '/infrastructure',
        meta: { title: '基础设施1' }
      }
    ]
  },
  {
    name: 'workload',
    path: '/workload',
    meta: {
      title:      '工作负载',
      icon:       require('~/assets/images/workload.png'),
      alwaysShow: true
    }
  },
  {
    name: 'lot-management',
    meta: {
      title:      'loT 管理',
      icon:       require('~/assets/images/iot-management.png'),
      alwaysShow: true
    },
    children: [
      {
        name:     'device-model',
        meta:     { title: '设备模版' },
        children: [
          {
            path: '/device-model/dummydevice',
            meta: { title: 'DummyDevice' }
          },
          {
            path: '/device-model/bluetoothdevice',
            meta: { title: 'BluetoothDevice' }
          },
          {
            path: '/device-model/modbusdevice',
            meta: { title: 'ModbusDevice' }
          }
        ]
      },
      {
        path: '/device',
        meta: { title: '设备列表' }
      }
    ]
  },
  {
    name: 'edge-ai',
    path: '/edge-ai',
    meta: {
      title: '边缘 AI',
      icon:  require('~/assets/images/edge-ai.png'),
    }
  },
  {
    name: 'mqtt-management',
    meta: {
      title: 'MQTT 管理',
      icon:  require('~/assets/images/mqtt.png'),
    },
    children: [
      {
        path: '/mqtt-management',
        meta: { title: 'MQTT 管理1' }
      }
    ]
  },
  {
    name: 'setting',
    meta: {
      title: '系统管理',
      icon:  require('~/assets/images/setting.png'),
    },
    children: [
      {
        path: '/setting',
        meta: { title: '系统管理1' }
      }
    ]
  },
];
