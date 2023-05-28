import Joi from 'joi'
import { minNameLength } from 'schemasValidation/constants'

const updateCompanySchema = Joi.object({
  name: Joi.string().min(minNameLength).allow('', null).optional(),
  slug: Joi.string().min(minNameLength).allow('', null).optional(),
  imageUrl: Joi.string().allow('', null).optional()
})

export default updateCompanySchema
