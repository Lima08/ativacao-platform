import Joi from 'joi'

import { eUserValidation } from '../eSchemaValidation'

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(eUserValidation.minPasswordLength).required(),
  name: Joi.string().min(eUserValidation.minNameLength).required(),
  companyId: Joi.string().required()
})


export default loginSchema
