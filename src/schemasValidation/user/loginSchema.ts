import Joi from 'joi'
import { minNameLength, minPasswordLength } from 'schemasValidation/constants'

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(minPasswordLength).required(),
  name: Joi.string().min(minNameLength).required(),
  companyId: Joi.string().required()
})

export default loginSchema
