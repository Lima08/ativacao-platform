import Joi from 'joi'

import { eUserValidation } from './eSchemaValidation'

const updateSchema = Joi.object({
  name: Joi.string().min(eUserValidation.minNameLength).optional(),
  password: Joi.string().min(eUserValidation.minPasswordLength).optional(),
  imageUrl: Joi.string().optional(),
  role: Joi.number().optional(),
  isActive: Joi.boolean().optional()
})

export default { updateSchema }
