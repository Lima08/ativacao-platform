import { prisma } from 'lib/prisma'
import { Campaign } from 'models/Campaign'
import CustomError from 'constants/errors/CustoError'
import {
  ICampaignCreated,
  ICampaignFilter,
  ICampaignModifier,
  ICampaign
} from 'interfaces/entities/campaign'

const repository = Campaign.of(prisma)

async function createCampaign(
  params: ICampaign
): Promise<ICampaignCreated | undefined> {
  try {
    const newCampaign = await repository.create(params)
    return newCampaign
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error creating campaign', 400, meta)
  }
}

async function getCampaigns(
  filter: ICampaignFilter
): Promise<ICampaignCreated[]> {
  try {
    const newCampaigns = await repository.getAll(filter)
    return newCampaigns
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error to get campaigns', 500, meta)
  }
}

async function updateCampaign(
  id: string,
  params: ICampaignModifier
): Promise<ICampaignCreated> {
 try {
   const updatedCampaign = await repository.update(id, params)
   return updatedCampaign
 } catch (error: any) {
  const meta = error.meta
  throw new CustomError('Error to update campaign', 400, meta)
}
}

async function deleteCampaign(id: string): Promise<void> {
  try {
    await repository.delete(id)
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error to delete campaign', 400, meta)
  }
}

export { createCampaign, getCampaigns, updateCampaign, deleteCampaign }
