import { IMediaCreated } from '../media'
import type { ICampaign } from './ICampaign'

export interface ICampaignCreated extends ICampaign {
  id: string
  medias: IMediaCreated[]
  createdAt: Date
  updatedAt: Date
}
