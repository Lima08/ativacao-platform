import { ICampaign, ICampaignCreated, ICampaignModifier } from 'interfaces/entities/campaign'
import { IMediaCreated } from 'interfaces/entities/media'

export interface newCampaignDto extends ICampaign {
  mediaIds?: string[]
}

export interface createdCampaignDto extends ICampaignCreated {
  medias: IMediaCreated[]
}

export interface modifierCampaignDto extends ICampaignModifier {
  mediaIds?:  string[]
}
