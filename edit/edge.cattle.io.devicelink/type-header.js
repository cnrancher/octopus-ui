// bluethooth-header
const name = {
  name:      'name',
  label:     '属性名称',
  value:     'name',
  width:      80,
};

const accessMode = {
  name:      'accessMode',
  label:     '访问模式',
  value:     'accessMode',
  width:      80,
};

const description = {
  name:      'description',
  label:     '描述',
  value:     'description',
  width:      120,
};

const UUID = {
  name:      'UUID',
  label:     'UUID',
  value:     'visitor.characteristicUUID',
  width:      220,
};

// modbus-header
const dataType = {
  name:      'dataType',
  label:     'dataType',
  value:     'dataType',
  width:      220,
};

const value = {
  name:      'value',
  label:     'value',
  value:     'value',
  width:      220,
};

// opcua-header
const nodeID = {
  name:      'nodeID',
  label:     'nodeID',
  value:     'visitor.nodeID',
  width:      220,
};

export const BluethoothDeviceHeader = [
  name,
  accessMode,
  description,
  UUID
];

export const ModbusDeviceHeader = [
  name,
  dataType,
  value
];

export const OPCUADeviceHeader = [
  name,
  dataType,
  value,
  nodeID
];
