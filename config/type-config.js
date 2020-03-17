/* eslint-disable */
import {
  ignoreType,
  basicType,
  mapType,
  mapTypeToComponentName,
  virtualType,
  ignoreGroup,
  weightGroup,
  mapGroup,
  headers,
} from '@/utils/customized';

import {
  CONFIG_MAP, NODE, POD, SECRET, RBAC, SERVICE, PV, PVC, INGRESS, SCHEMA
} from '@/config/types';

import {
  STATE,
  NAME, NAMESPACE_NAME, NAMESPACE_NAME_IMAGE,
  AGE, WEIGHT, SCALE,
  KEYS, ENDPOINTS,
  MATCHES, DESTINATION,
  TARGET, TARGET_KIND, USERNAME, USER_DISPLAY_NAME, USER_ID, USER_STATUS,
  NODE_NAME, ROLES,
  VERSION, CPU,
  RAM, PODS,
  BINGRESS_TARGET,
  TYPE,
  NAMESPACE,
} from '@/config/table-headers';

import { ucFirst } from '@/utils/string';

export default function() {
  basicType([
    CONFIG_MAP,
    // NAMESPACE,
    NODE,
    POD,
    SECRET,
    SERVICE,
    INGRESS,
    PV,
    PVC,
  ]);

  ignoreType('events.k8s.io.v1beta1.event'); // Events type moved into core
  ignoreType('extensions.v1beta1.ingress'); // Moved into networking

  mapType('core.v1.endpoints', 'Endpoint'); // Bad plural

  // Move some core things into Cluster
  mapType(/^core\.v1\.(namespace|node|persistentvolume)$/, (out, match, schema) => {
    schema.attributes.group = 'Cluster';

    return out;
  }, 99, true);

  // mapType(/.*/, (typeStr, match, schema) => {
  //   return schema.attributes.kind;
  // }, 1);

  weightGroup('Cluster', 99);
  weightGroup('Core', 98);

  mapGroup(/^(core)?$/, 'Core', 99);
  mapGroup('apps', 'Core');
  mapGroup('batch', 'Core');
  mapGroup('extensions', 'Core');
  mapGroup('autoscaling', 'Autoscaling');
  mapGroup('policy', 'Policy');
  mapGroup('networking.k8s.io', 'Core');
  mapGroup(/^api.*\.k8s\.io$/, 'API');
  mapGroup('rbac.authorization.k8s.io', 'RBAC');
  mapGroup('admissionregistration.k8s.io', 'Admission');
  mapGroup('crd.projectcalico.org', 'Calico');
  mapGroup(/^(.+\.)?cert-manager\.(k8s\.)?io$/, 'Cert Manager');
  mapGroup(/^(gateway|gloo)\.solo\.io$/, 'Gloo');
  mapGroup(/^(.*\.)?monitoring\.coreos\.com$/, 'Monitoring');
  mapGroup(/^(.*\.)?tekton\.dev$/, 'Tekton');
  mapGroup(/^(.*\.)?longhorn\.rancher\.io$/, 'Longhorn');
  mapGroup(/^(.*\.)?cattle\.io$/, 'Rancher');
  mapGroup(/^(.*\.)?istio\.io$/, 'Istio');
  mapGroup(/^(.*\.)?knative\.io$/, 'Knative');

  mapGroup(/^(.*)\.k8s\.io$/, (group, match) => {
    return match[1].split(/\./).map(x => ucFirst(x)).join('.');
  }, 1);

  headers(CONFIG_MAP, [STATE, NAMESPACE_NAME, KEYS, AGE]);
  // headers(NAMESPACE, [STATE, NAME, AGE]);
  headers(NODE, [STATE, NODE_NAME, ROLES, VERSION, CPU, RAM, PODS]);
  headers(SECRET, [
    STATE,
    NAMESPACE_NAME,
    KEYS,
    {
      name:  'type',
      label: 'Type',
      value: 'typeDisplay',
      sort:  ['typeDisplay', 'nameSort'],
    },
    AGE
  ]);

  headers(SCHEMA, [
    STATE,
    NAME,
    NAMESPACE,
    AGE
  ]);

  virtualType({
    label:      'Workload',
    namespaced: true,
    name:       'workloads',
    group:      'Core',
    route:      {
      name:     'c-cluster-workloads',
      params:   { resource: 'workload' }
    },
  });

  // OPA Gatekeeper
  mapTypeToComponentName(/^constraints.gatekeeper.sh\..*$/, 'gatekeeper-constraint');
  ignoreGroup(/^.*\.gatekeeper\.sh$/);

  virtualType({
    label:      'OPA Gatekeeper',
    namespaced: false,
    name:       'gatekeeper',
    group:      'Cluster',
    route:      { name: 'c-cluster-gatekeeper' },
  });

  virtualType({
    label:      'Constraints',
    namespaced: false,
    name:       'gatkeeper-constraints',
    group:      'Cluster::OPA Gatekeeper',
    route:      { name: 'c-cluster-gatekeeper-constraints' },
  });

  virtualType({
    label:      'Templates',
    namespaced: false,
    name:       'gatkeeper-templates',
    group:      'Cluster::OPA Gatekeeper',
    route:      { name: 'c-cluster-gatekeeper-templates' },
  });
}
