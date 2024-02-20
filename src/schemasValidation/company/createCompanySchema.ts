import Joi from 'joi'

import { minNameLength, maxNameLength } from './../../constants'

const createCompanySchema = Joi.object({
  name: Joi.string().min(minNameLength).max(maxNameLength).required(),
  slug: Joi.string().min(minNameLength).required(),
  imageUrl: Joi.string().allow('', null).optional()
})

export default createCompanySchema
