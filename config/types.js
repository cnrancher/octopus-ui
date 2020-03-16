// Steve
export const API_GROUP = 'apiGroups';
export const CONFIG_MAP = 'core.v1.configmap';
export const COUNT = 'count';
export const EVENT = 'core.v1.event';
export const NAMESPACE = 'core.v1.namespace';
export const NODE = 'core.v1.node';
export const POD = 'core.v1.pod';
export const RESOURCE_QUOTA = 'core.v1.resourcequota';
export const SCHEMA = 'schema';
export const SECRET = 'core.v1.secret';
export const SERVICE_ACCOUNT = 'core.v1.serviceaccount';
export const SERVICE = 'core.v1.service';
export const INGRESS = 'networking.k8s.io.v1beta1.ingress';
export const PV = 'core.v1.persistentvolume';
export const PVC = 'core.v1.persistentvolumeclaim';
export const TLS_CERT = 'kubernetes.io/tls';

export const HELM = 'helm.cattle.io.v1.helmchart';
export const DEVICE_LINK='edge.cattle.io.v1alpha1.devicelinks';
export const DUMMY_DEVICE = 'devices.edge.cattle.io.v1alpha1.dummydevices';

export const RBAC = {
  ROLE:                 'rbac.authorization.k8s.io.v1.role',
  CLUSTER_ROLE:         'rbac.authorization.k8s.io.v1.clusterrole',
  ROLE_BINDING:         'rbac.authorization.k8s.io.v1.rolebinding',
  CLUSTER_ROLE_BINDING: 'rbac.authorization.k8s.io.v1.clusterrolebinding',
};

export const WORKLOAD = {
  DEPLOYMENT:             'apps.v1.deployment',
  DAEMON_SET:             'apps.v1.daemonset',
  STATEFUL_SET:           'apps.v1.statefulset',
  CRON_JOB:               'batch.v1beta1.cronjob',
  JOB:                    'batch.v1.job',
  REPLICA_SET:            'apps.v1.replicaset',
  REPLICATION_CONTROLLER: 'core.v1.replicationcontroller'
};

export const RIO = {
  CLUSTER_DOMAIN:   'admin.rio.cattle.io.v1.clusterdomain',
  FEATURE:          'admin.rio.cattle.io.v1.feature',
  INFO:             'admin.rio.cattle.io.v1.rioinfo',
  PUBLIC_DOMAIN:    'admin.rio.cattle.io.v1.publicdomain',

  APP:              'rio.cattle.io.v1.app',
  EXTERNAL_SERVICE: 'rio.cattle.io.v1.externalservice',
  STACK:            'rio.cattle.io.v1.stack',
  ROUTER:           'rio.cattle.io.v1.router',
  SERVICE:          'rio.cattle.io.v1.service',

  SYSTEM_NAMESPACE: 'rio-system',

};
