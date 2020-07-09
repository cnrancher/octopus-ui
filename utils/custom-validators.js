import { servicePort } from '@/utils/validators/service-port';
/**
* Custom validation functions beyond normal scalr types
* Validator must export a function name should match the validator name on the customValidationRules rule
* Exported function is used as a lookup key in resource-instance:validationErrors:customValidationRules loop
*/
export default { servicePort };
