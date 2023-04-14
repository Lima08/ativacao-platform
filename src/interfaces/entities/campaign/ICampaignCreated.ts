import type { ICampaign } from './ICampaign'

export interface ICampaignCreated extends ICampaign {
  id: string
  createdAt: Date
  updatedAt: Date
}
