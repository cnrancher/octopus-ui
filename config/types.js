// Steve
export const API_GROUP = 'apiGroups';
export const CONFIG_MAP = 'configmap';
export const COUNT = 'count';
export const EVENT = 'event';
export const NAMESPACE = 'namespace';
export const NODE = 'node';
export const POD = 'pod';
export const RESOURCE_QUOTA = 'resourcequota';
export const SCHEMA = 'schema';
export const SECRET = 'secret';
export const SERVICE_ACCOUNT = 'serviceaccount';
export const SERVICE = 'service';
export const INGRESS = 'networking.k8s.io.ingress';
export const PV = 'persistentvolume';
export const PVC = 'persistentvolumeclaim';
export const TLS_CERT = 'kubernetes.io/tls';
export const GATEKEEPER_CONSTRAINT_TEMPLATE = 'templates.gatekeeper.sh.constrainttemplate';

export const K3S = { ADDON: 'k3s.cattle.io.addon' };

export const NAMESPACES = 'namespaces';
export const COMPONENTSTATUS = 'componentstatus';
export const DEVICE_LINK = 'edge.cattle.io.devicelink';
export const PREFIX_DEVICE = 'devices.edge.cattle.io.';
export const CUSTOM = 'apiextensions.k8s.io.customresourcedefinitions';
export const DUMMY_DEVICE = 'devices.edge.cattle.io.dummydevice';
export const CATALOG = 'octopusapi.cattle.io.catalog';
export const HELM = 'helm.cattle.io.helmchart';
export const JOB = 'batch.job';

export const COLLECTION_TYPES = {
  array: 'array',
  map:   'map',
};

export const PRIMITIVE_TYPES = {
  string:    'string',
  multiline: 'multiline',
  masked:    'masked',
  password:  'password',
  float:     'float',
  int:       'int',
  date:      'date',
  blob:      'blob',
  boolean:   'boolean',
  json:      'json',
  version:   'version',
};

// Old Rancher API via Norman, /v3
export const NORMAN = { // None
  AUTH_CONFIG: 'authconfig',
  PRINCIPAL:   'principal',
  SETTING:     'setting',
};

// Rancher Management API via Steve, /v1
export const MANAGEMENT = {
  CATALOG:          'management.cattle.io.catalog',
  CATALOG_TEMPLATE: 'management.cattle.io.catalogtemplate',
  CLUSTER:          'management.cattle.io.cluster',
  USER:             'management.cattle.io.user',
  PREFERENCE:       'userpreference',
  NODE_POOL:        'management.cattle.io.nodepool',
  NODE_TEMPLATE:    'management.cattle.io.nodetemplate',
};

// Rancher cluster-scoped things that actually live in management plane
// /v1/management.cattle.io.clusters/<id>/
export const EXTERNAL = { // None
  PROJECT: 'project',
  APP:     'app',
};

// Other types via Steve, /k8s/clusters/<id>/v1/

export const RBAC = {
  ROLE:                 'rbac.authorization.k8s.io.role',
  CLUSTER_ROLE:         'rbac.authorization.k8s.io.clusterrole',
  ROLE_BINDING:         'rbac.authorization.k8s.io.rolebinding',
  CLUSTER_ROLE_BINDING: 'rbac.authorization.k8s.io.clusterrolebinding',
};

export const RIO = {
  CLUSTER_DOMAIN:   'admin.rio.cattle.io.clusterdomain',
  FEATURE:          'admin.rio.cattle.io.feature',
  INFO:             'admin.rio.cattle.io.rioinfo',
  PUBLIC_DOMAIN:    'admin.rio.cattle.io.publicdomain',

  APP:              'rio.cattle.io.app',
  EXTERNAL_SERVICE: 'rio.cattle.io.externalservice',
  STACK:            'rio.cattle.io.stack',
  ROUTER:           'rio.cattle.io.router',
  SERVICE:          'rio.cattle.io.service',

  SYSTEM_NAMESPACE: 'rio-system',
};

export const WORKLOAD = 'workload';

export const SETTING = 'octopusapi.cattle.io.setting';

// The types that are aggregated into a "workload"
export const WORKLOAD_TYPES = {
  DEPLOYMENT:             'apps.deployment',
  DAEMON_SET:             'apps.daemonset',
  STATEFUL_SET:           'apps.statefulset',
  CRON_JOB:               'batch.cronjob',
  JOB:                    'batch.job',
  REPLICA_SET:            'apps.replicaset',
  REPLICATION_CONTROLLER: 'replicationcontroller'
};

export const DEVICE_PROTOCOL = {
  CUSTOM:                     'apiextensions.k8s.io.customresourcedefinition',
  DAEMONSET:                  'apps.daemonset',
  DEPLOYMENT:                 'apps.deployment',
  RBAC_CLUSTERROLEBINDING:    'rbac.authorization.k8s.io.clusterrolebinding',
  RBAC_CLUSTERROLEL:          'rbac.authorization.k8s.io.clusterrole'
};

export const DEVICE_TEMPLATE = {
  TEMPLATE:     'octopusapi.cattle.io.devicetemplate',
  REVISION:     'octopusapi.cattle.io.devicetemplaterevision'
};

export const STORAGE_CATEGORY = {
  PERSISTENT_VOLUME:      'persistentvolume',
  STORAGE_CLASS:          'storage.k8s.io.storageclass'
};

export const METRIC = { // None
  NODE: 'metrics.k8s.io.nodemetrics',
  POD:  'metrics.k8s.io.podmetrics',
};

export const OFFICIAL_DEVICE = ['ModbusDevice', 'BluetoothDevice', 'OPCUADevice', 'MQTTDevice'];

export const GATEKEEPER = {
  TEMPLATE_ID: 'cattle-global-data/system-library-rancher-gatekeeper-operator',
  APP_ID:      'rancher-gatekeeper-operator',
  CONFIG:      `---
replicas: 1
auditInterval: 300
constraintViolationsLimit: 20
auditFromCache: false
image:
  repository: rancher/opa-gatekeeper
  tag: v3.1.0-beta.7
  pullPolicy: IfNotPresent
nodeSelector: {"beta.kubernetes.io/os": "linux"}
tolerations: []
resources:
  limits:
    cpu: 1000m
    memory: 512Mi
  requests:
    cpu: 100m
    memory: 256Mi
global:
  systemDefaultRegistry: ""
  kubectl:
    repository: rancher/istio-kubectl
    tag: 1.4.6
`
};

export const SYSTEM_PROJECT_LABEL = 'authz.management.cattle.io/system-project';
