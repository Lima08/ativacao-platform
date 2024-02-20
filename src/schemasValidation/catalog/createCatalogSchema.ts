import Joi from 'joi'

import { minNameLength, maxNameLength, maxDescriptionLength } from '../../constants'

const createCatalogSchema = Joi.object({
  userId: Joi.string().required(),
  name: Joi.string().min(minNameLength).max(maxNameLength).required(),
  description: Joi.string().max(maxDescriptionLength).allow('', null).optional(),
  mediaIds: Joi.array().items(Joi.string()).allow(null).optional(),
  documentIds: Joi.array().items(Joi.string()).allow(null).optional()
})

export default createCatalogSchema
