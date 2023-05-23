import Joi from 'joi'

import { eUserValidation } from './eSchemaValidation'

const createSchema = Joi.object({
  companyId: Joi.string().required(),
  userId: Joi.string().required(),
  name: Joi.string().min(eUserValidation.minNameLength).required(),
  description: Joi.string().allow('', null).optional(),
  mediaIds: Joi.array().items(Joi.string()).allow(null).optional()
})

export default { createSchema }
