import Joi from 'joi'

import { eUserValidation } from '../eSchemaValidation'

const updateSchema = Joi.object({
  name: Joi.string().min(eUserValidation.minNameLength).allow( null).optional(),
  password: Joi.string().min(eUserValidation.minPasswordLength).allow( null).optional(),
  role: Joi.number().valid(100, 200, 300).allow(null).optional(),
  imageUrl: Joi.string().allow(null).optional(),
  isActive: Joi.boolean().allow(null).optional(),
})

export default updateSchema
