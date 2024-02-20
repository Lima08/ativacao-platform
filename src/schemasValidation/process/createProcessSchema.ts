import Joi from 'joi'

import { minNameLength, maxNameLength } from '../../constants'

const createProcessSchema = Joi.object({
  title: Joi.string().min(minNameLength).max(maxNameLength).required(),
  templateProcessId: Joi.string().required(),
  userId: Joi.string().required(),
  companyId: Joi.string().required(),
  documentIds: Joi.array().items(Joi.string()).allow(null).optional()
})

export default createProcessSchema
