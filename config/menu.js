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
        path: '/infrastructure/node-management',
        meta: { title: '节点管理' }
      },
      {
        path: '/infrastructure/system-services',
        meta: { title: '系统服务' }
      },
      {
        path: '/infrastructure/namespace',
        meta: { title: '命名空间' }
      },
      {
        path: '/infrastructure/store-category',
        meta: { title: '存储类别' }
      }
    ]
  },
  {
    name: 'workload',
    path: '/workload',
    meta: {
      title:      '工作负载',
      icon:       require('~/assets/images/workload.png'),
    },
    children: [
      {
        path: '/workload',
        meta: { title: '工作负载' }
      },
      {
        path: '/workload/secret-management',
        meta: { title: '秘文管理' }
      },
      {
        path: '/workload/configure-map',
        meta: { title: '配置映射' }
      }
    ]
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
        children: []
      },
      {
        path: '/device/edge.cattle.io.v1alpha1.devicelink',
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
    name: 'system-management',
    meta: {
      title: '系统管理',
      icon:  require('~/assets/images/setting.png'),
    },
    children: [
      {
        path: '/system-management/setting',
        meta: { title: '系统设置' }
      },
      {
        path: '/system-management/data-backup',
        meta: { title: '数据备份' }
      }
    ]
  },
];
