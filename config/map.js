export const accessMode = [{
  label: 'NotifyOnly',
  value: 'NotifyOnly'
}, {
  label: 'ReadOnly',
  value: 'ReadOnly'
}, {
  label: 'ReadWrite',
  value: 'ReadWrite'
}];

export const parity = [{
  label: 'None',
  value: 'N'
}, {
  label: 'Even',
  value: 'E'
}, {
  label: 'Odd',
  value: 'O'
}];

export const dataBits = [{
  label: '5',
  value: '5'
}, {
  label: '6',
  value: '6'
}, {
  label: '7',
  value: '7'
}, {
  label: '8',
  value: '8'
}];

export const typeOption = [{
  value: 'string',
  label: 'string'
}, {
  value: 'int',
  label: 'int'
}, {
  value: 'float',
  label: 'float'
}, {
  value: 'boolean',
  label: 'boolean'
}];

export const register = [{
  value:    'CoilRegister',
  label:    '线圈寄存器',
  readOnly: 'false',
}, {
  value:    'DiscreteInputRegister',
  label:    '离散输入寄存器',
  readOnly: 'true'
}, {
  value:    'HoldingRegister',
  label:    '保持寄存器',
  readOnly: 'false'
}, {
  value:    'InputRegister',
  label:    '输入寄存器',
  readOnly: 'true'
}];