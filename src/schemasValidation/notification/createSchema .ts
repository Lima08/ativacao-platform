import Joi from 'joi'

import {
  minNameLength,
  maxNameLength,
  maxDescriptionLength
} from './../../constants'

const createSchema = Joi.object({
  companyId: Joi.string().required(),
  userId: Joi.string().required(),
  title: Joi.string().min(minNameLength).max(maxNameLength).required(),
  description: Joi.string().max(maxDescriptionLength).required(),
  link: Joi.string().allow('', null).optional(),
  imageUrl: Joi.string().allow('', null).optional()
})

export default createSchema
