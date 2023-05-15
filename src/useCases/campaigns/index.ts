import CustomError from 'constants/errors/CustoError'
import { ICampaignCreated, ICampaignFilter } from 'interfaces/entities/campaign'
import { IMediaCreated } from 'interfaces/entities/media'
import { prisma } from 'lib/prisma'
import { Campaign } from 'models/Campaign'

import { updateMedia, getMediasBy, deleteMedia } from '../media'
import { createdCampaignDto, newCampaignDto, modifierCampaignDto } from './dto'

const repository = Campaign.of(prisma)

async function createCampaign({
  name,
  description,
  companyId,
  userId,
  mediaIds
}: newCampaignDto): Promise<any> {
  const newCampaign = await repository
    .create({
      name,
      description,
      companyId,
      userId
    })
    .catch((error: any) => {
      console.log('🚀 ~ file: index.ts:26 ~ error:', error)
      const meta = error.meta
      throw new CustomError('Error creating campaign', 400, meta)
    })

  if (!newCampaign) throw new CustomError('Error creating campaign', 400)

  let medias: IMediaCreated[] = []
  if (mediaIds && mediaIds.length) {
    const promises = mediaIds.map((mediaId) =>
      updateMedia(mediaId, { campaignId: newCampaign.id })
    )

    await Promise.all(promises)
      .then((files) => (medias = files))
      .catch((error: any) => {
        const meta = error.meta
        throw new CustomError('Error in creating campaign media', 400, {
          ...meta,
          createdCampaign: newCampaign
        })
      })
  }

  return { ...newCampaign, medias }
}

async function getCampaignById(id: string): Promise<createdCampaignDto> {
  try {
    const campaign = await repository.getOneBy(id)

    let medias: IMediaCreated[] = []
    if (campaign) {
      medias = await getMediasBy({ campaignId: campaign.id })
    }

    return { ...campaign, medias }
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error to get campaign', 500, meta)
  }
}

async function getAllCampaigns(
  filter: ICampaignFilter
): Promise<ICampaignCreated[]> {
  try {
    const allCampaigns = await repository.getAll(filter)
    const allCampaignsWithMedia: ICampaignCreated[] = []

    for (const campaign of allCampaigns) {
      const medias = await getMediasBy({ campaignId: campaign.id })

      allCampaignsWithMedia.push({ ...campaign, medias: medias || [] })
    }

    return allCampaignsWithMedia
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error to get campaigns', 500, meta)
  }
}

async function updateCampaign(
  id: string,
  { name, description, active, mediaIds }: modifierCampaignDto
): Promise<createdCampaignDto> {
  const updatedCampaign = await repository
    .update(id, { name, description, active })
    .catch((error: any) => {
      const meta = error.meta
      throw new CustomError('Error to update campaign', 400, meta)
    })

  let medias: IMediaCreated[] = []

  if (mediaIds?.length) {
    const promises = mediaIds.map((id) =>
      updateMedia(id, { campaignId: updatedCampaign.id })
    )

    await Promise.all(promises)
      .then((files) => (medias = files))
      .catch((error: any) => {
        const meta = error.meta
        throw new CustomError('Error to update campaign media', 400, meta)
      })
  }

  return { ...updatedCampaign, medias }
}

async function deleteCampaign(id: string): Promise<void> {
  const allMedias = await getMediasBy({ campaignId: id })
  if (allMedias.length) {
    const promises = allMedias.map((media) => deleteMedia(media.id))
    await Promise.all(promises).catch((error: any) => {
      const meta = error.meta
      throw new CustomError('Error to delete campaign media', 500, meta)
    })
  }

  await repository.delete(id).catch((error: any) => {
    const meta = error.meta
    throw new CustomError('Error to delete campaign', 400, meta)
  })
}

export {
  createCampaign,
  getCampaignById,
  getAllCampaigns,
  updateCampaign,
  deleteCampaign
}
