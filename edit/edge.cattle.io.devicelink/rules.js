export function validatorMacAddress(ule, value, callback) {
  const regex = '(([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2})|(([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2})';
  const regexp = new RegExp(regex);

  if (!regexp.test(value)) {
    return false;
  }

  return true;
}

export function validateIP(rule, value, callback) {
  const regex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

  if (regex.test(value)) {
    callback();
  } else {
    callback(new Error('请输入合法ip!'));
  }
}
