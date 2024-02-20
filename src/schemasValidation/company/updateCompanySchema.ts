import Joi from 'joi'

import { minNameLength, maxNameLength } from './../../constants'

const updateCompanySchema = Joi.object({
  name: Joi.string().min(minNameLength).max(maxNameLength).allow('', null).optional(),
  slug: Joi.string().min(minNameLength).allow('', null).optional(),
  imageUrl: Joi.string().allow('', null).optional()
})

export default updateCompanySchema
