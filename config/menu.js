export const MENUS = [
  {
    name: 'globalOverview',
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
        meta: { title: '节点管理' },
        name: 'node-manage'
      },
      {
        path: '/c/local/system.service',
        meta: { title: '系统服务' },
        name: 'system-service'
      },
      {
        path: '/c/local/namespace',
        meta: { title: '命名空间' },
        name: 'namespace'
      },
      {
        path: '/c/local/storage.k8s.io.storageclass',
        meta: { title: '存储类别' },
      },
      {
        path: '/c/local/persistentvolume',
        meta: { title: '存储卷' },
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
        meta: { title: '工作负载' },
        name: 'workload'
      },
      {
        path: '/c/local/service',
        meta: { title: '服务发现' },
        name: 'service'
      },
      {
        path: '/c/local/secret',
        meta: { title: '秘文管理' },
        name: 'secret-manage'
      },
      {
        path: '/c/local/configmap',
        meta: { title: '配置映射' },
        name: 'configmap'
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
        name: 'deviceprotocol'
      },
      {
        path: '/c/local/edge.cattle.io.devicelink',
        meta: { title: '设备列表' },
        name: 'devicelink'
      },
      {
        path: '/c/local/octopusapi.cattle.io.devicetemplate',
        meta: { title: '设备模板' },
        name: 'device-template'
      },
    ]
  },
  {
    name: 'app-market',
    path: '/c/local/helm.cattle.io.helmchart',
    meta: {
      title: '应用市场',
      icon:  'icon-library',
    },
  }
];
