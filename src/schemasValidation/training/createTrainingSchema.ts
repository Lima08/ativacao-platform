import Joi from 'joi'

import { minNameLength } from './../../constants'

const createTrainingSchema = Joi.object({
  companyId: Joi.string().required(),
  userId: Joi.string().required(),
  name: Joi.string().min(minNameLength).required(),
  description: Joi.string().allow('', null).optional(),
  mediaIds: Joi.array().items(Joi.string()).allow(null).optional()
})

export default { createTrainingSchema }
