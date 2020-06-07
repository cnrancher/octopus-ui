export function validatorMacAddress(ule, value, callback) {
  const regex = '(([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2})|(([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2})';
  const regexp = new RegExp(regex);

  if (!regexp.test(value)) {
    return false;
  }

  return true;
}

export function validateAccessConfig(rule, value, callback) {
  if (this.value.spec.template.spec.macAddress && this.value.spec.template.spec.namespace) {
    callback(new Error('name 或 macAddress不能同时为空'));
  } else {
    callback();
  }
}
