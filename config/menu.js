export const MENUS = [
  {
    name: 'global-overview',
    path: '/global-overview',
    meta: {
      title: '全局概览',
      icon:  'icon-global-resource',
    }
  },
  {
    name: 'infrastructure',
    meta: {
      title: '基础设施',
      icon:  'icon-infrastructure',
    },
    children: [
      {
        name: 'infrastructure/node-management',
        path: '/infrastructure/node-management',
        meta: { title: '节点管理' }
      },
      {
        name: 'infrastructure/system-services',
        path: '/infrastructure/system-services',
        meta: { title: '系统服务' }
      },
      {
        name: 'infrastructure/namespace',
        path: '/infrastructure/namespace',
        meta: { title: '命名空间' }
      },
      {
        name: 'infrastructure/store-category',
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
      icon:       'icon-workload',
    },
    children: [
      {
        name: 'workload/default',
        path: '/workload',
        meta: { title: '工作负载' }
      },
      {
        name: 'workload/secret-management',
        path: '/workload/secret-management',
        meta: { title: '秘文管理' }
      },
      {
        name: 'workload/configure-map',
        path: '/workload/configure-map',
        meta: { title: '配置映射' }
      }
    ]
  },
  {
    name: 'lot-management',
    meta: {
      title:      'loT 管理',
      icon:       'icon-iot-management'
    },
    children: [
      {
        name: 'lot-management/deviceProtocol',
        path: '/deviceProtocol',
        meta:     { title: '设备协议' },
      },
      {
        name: 'lot-management/device/edge.cattle.io.v1alpha1.devicelink',
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
      icon:  'icon-edge-ai',
    }
  },
  {
    name: 'mqtt-management',
    meta: {
      title: 'MQTT 管理',
      icon:  'icon-mqtt',
    },
    children: [
      {
        name: 'mqtt-management/default',
        path: '/mqtt-management',
        meta: { title: 'MQTT 管理1' }
      }
    ]
  },
  {
    name: 'system-management',
    meta: {
      title: '系统管理',
      icon:  'icon-setting',
    },
    children: [
      {
        name: 'system-management/setting',
        path: '/system-management/setting',
        meta: { title: '系统设置' }
      },
      {
        name: 'system-management/data-backup',
        path: '/system-management/data-backup',
        meta: { title: '数据备份' }
      }
    ]
  },
];
