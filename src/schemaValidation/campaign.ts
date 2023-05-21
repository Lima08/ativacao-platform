import { ROLES } from 'constants/enums/eRoles'
import Joi from 'joi'

import { eUserValidation } from './eSchemaValidation'

const createSchema = Joi.object({
  companyId: Joi.string().required(),
  userId: Joi.string().required(),
  name: Joi.string().min(eUserValidation.minNameLength).required(),
  description: Joi.string().optional(),
  mediaIds: Joi.array().items(Joi.string()).allow(null).optional(),
  role: Joi.number().min(ROLES.COMPANY_ADMIN).required()
})

export default { createSchema }
