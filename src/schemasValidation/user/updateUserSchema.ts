import Joi from 'joi'

import {
  minNameLength,
  minPasswordLength,
  maxNameLength
} from './../../constants'

const updateUserSchema = Joi.object({
  name: Joi.string()
    .min(minNameLength)
    .max(maxNameLength)
    .allow(null)
    .optional(),
  password: Joi.string().min(minPasswordLength).allow(null).optional(),
  role: Joi.number().valid(100, 200, 300, 400).allow(null).optional(),
  imageUrl: Joi.string().allow(null).optional(),
  isActive: Joi.boolean().allow(null).optional(),
  companyId: Joi.string().allow(null).optional()
})

export default updateUserSchema
