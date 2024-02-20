import Joi from 'joi'

import {
  minNameLength,
  minPasswordLength,
  maxNameLength
} from './../../constants'

const createUserSchema = Joi.object({
  name: Joi.string().min(minNameLength).max(maxNameLength).optional(),
  password: Joi.string().min(minPasswordLength).optional(),
  imageUrl: Joi.string().optional(),
  role: Joi.number().optional(),
  isActive: Joi.boolean().optional()
})

export default { createUserSchema }
