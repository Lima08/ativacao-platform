import Joi from 'joi'
import { minNameLength } from 'schemasValidation/constants'

const createCompanySchema = Joi.object({
  name: Joi.string().min(minNameLength).required(),
  slug: Joi.string().min(minNameLength).required(),
  imageUrl: Joi.string().allow('', null).optional()
})

export default createCompanySchema
