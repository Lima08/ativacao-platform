import {
  ICampaignCreated,
  ICampaignFilter,
  ICampaignModifier
} from 'interfaces/entities/campaign'
import { ICampaign } from 'interfaces/entities/campaign/ICampaign'
import { prisma } from 'lib/prisma'
import { Campaign } from 'models/Campaign'

const repository = Campaign.of(prisma)

async function createCampaign(params: ICampaign): Promise<ICampaignCreated> {
  const newCampaign = await repository.create(params)
  return newCampaign
}

async function getCampaigns(
  filter: ICampaignFilter
): Promise<ICampaignCreated[]> {
  const newCampaigns = await repository.getAll(filter)
  return newCampaigns
}

async function updateCampaign(
  id: string,
  params: ICampaignModifier
): Promise<ICampaignCreated> {
  const updatedCampaign = await repository.update(id, params)
  return updatedCampaign
}

async function deleteCampaign(id: string): Promise<void> {
  await repository.delete(id)
}

export { createCampaign, getCampaigns, updateCampaign, deleteCampaign }
