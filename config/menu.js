export const MENUS = [
  {
    name: 'global-overview',
    path: '/c/local',
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
        path: '/c/local/node',
        meta: { title: '节点管理' }
      },
      {
        path: '/c/local/workload',
        meta: { title: '系统服务' }
      },
      {
        path: '/c/local/namespace',
        meta: { title: '命名空间' }
      },
      {
        path: '/c/local/store',
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
        path: '/c/local/workload',
        meta: { title: '工作负载' }
      },
      {
        path: '/c/local/secret',
        meta: { title: '秘文管理' }
      },
      {
        path: '/c/local/configmap',
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
        path: '/c/local/deviceprotocol',
        meta: { title: '设备协议' },
      },
      {
        path: '/c/local/edge.cattle.io.devicelink',
        meta: { title: '设备列表' }
      },
      {
        path: '/c/local/edgeapi.cattle.io.devicetemplate',
        meta: { title: '设备模板' }
      },
    ]
  },
  {
    name: 'app-market',
    path: '/c/local/helm.cattle.io.helmchart',
    meta: {
      title: '应用市场',
      icon:  'icon-mqtt',
    },
  }
];
