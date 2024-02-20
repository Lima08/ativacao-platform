import Joi from 'joi'

import {
  minNameLength,
  minPasswordLength,
  maxNameLength
} from './../../constants'

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(minPasswordLength).required(),
  name: Joi.string().min(minNameLength).max(maxNameLength).required(),
  companyId: Joi.string().required()
})

export default loginSchema
