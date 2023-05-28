import Joi from 'joi'
import { minNameLength, minPasswordLength } from 'schemasValidation/constants'

const updateUserSchema = Joi.object({
  name: Joi.string().min(minNameLength).allow(null).optional(),
  password: Joi.string().min(minPasswordLength).allow(null).optional(),
  role: Joi.number().valid(100, 200, 300).allow(null).optional(),
  imageUrl: Joi.string().allow(null).optional(),
  isActive: Joi.boolean().allow(null).optional()
})

export default updateUserSchema
