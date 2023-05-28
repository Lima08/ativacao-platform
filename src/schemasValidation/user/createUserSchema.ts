import Joi from 'joi'
import { minNameLength, minPasswordLength } from 'schemasValidation/constants'

const createUserSchema = Joi.object({
  name: Joi.string().min(minNameLength).optional(),
  password: Joi.string().min(minPasswordLength).optional(),
  imageUrl: Joi.string().optional(),
  role: Joi.number().optional(),
  isActive: Joi.boolean().optional()
})

export default { createUserSchema }
