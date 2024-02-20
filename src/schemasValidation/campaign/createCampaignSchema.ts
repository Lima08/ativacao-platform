import Joi from 'joi'

import { minNameLength, maxNameLength } from './../../constants'

const createCampaignSchema = Joi.object({
  companyId: Joi.string().required(),
  userId: Joi.string().required(),
  name: Joi.string().min(minNameLength).max(maxNameLength).required(),
  description: Joi.string().allow('', null).optional(),
  mediaIds: Joi.array().items(Joi.string()).allow(null).optional()
})

export default createCampaignSchema
