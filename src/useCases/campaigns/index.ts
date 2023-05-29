import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import CustomError from 'errors/CustomError'
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
}: newCampaignDto): Promise<ICampaignCreated> {
  try {
    const newCampaign = await repository.create({
      name,
      description,
      companyId,
      userId
    })
    if (!newCampaign)
      throw new CustomError('Error creating campaign', HTTP_STATUS.BAD_REQUEST)

    let medias: IMediaCreated[] = []
    if (mediaIds && mediaIds.length) {
      const promises = mediaIds.map((mediaId) =>
        updateMedia(mediaId, { campaignId: newCampaign.id })
      )

      await Promise.all(promises)
        .then((files) => (medias = files))
        .catch((error: any) => {
          const meta = error.meta || error.message
          throw new CustomError(
            'Error in creating campaign media',
            HTTP_STATUS.BAD_REQUEST,
            {
              ...meta,
              createdCampaign: newCampaign
            }
          )
        })
    }

    return { ...newCampaign, medias }
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError(
      'Error creating campaign',
      HTTP_STATUS.BAD_REQUEST,
      meta
    )
  }
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
    const meta = error.meta || error.message
    throw new CustomError(
      'Error to get campaign',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      meta
    )
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
    const meta = error.meta || error.message
    throw new CustomError(
      'Error to get campaigns',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      meta
    )
  }
}

async function updateCampaign(
  id: string,
  { name, description, active, mediaIds, mediasToExclude }: modifierCampaignDto
): Promise<createdCampaignDto> {
  const updatedCampaign = await repository
    .update(id, { name, description, active })
    .catch((error: any) => {
      const meta = error.meta || error.message
      throw new CustomError(
        'Error to update campaign',
        HTTP_STATUS.BAD_REQUEST,
        meta
      )
    })

  let medias: IMediaCreated[] = []

  if (mediaIds?.length) {
    const promises = mediaIds.map((id) =>
      updateMedia(id, { campaignId: updatedCampaign.id })
    )

    await Promise.all(promises)
      .then((files) => (medias = files))
      .catch((error: any) => {
        const meta = error.meta || error.message
        throw new CustomError(
          'Error to update campaign media',
          HTTP_STATUS.BAD_REQUEST,
          meta
        )
      })

    if (mediasToExclude?.length) {
      const promisesToExclude = mediasToExclude.map((id) => deleteMedia(id))

      await Promise.all(promisesToExclude).catch((error: any) => {
        const meta = error.meta || error.message
        throw new CustomError(
          'Error to update campaign media',
          HTTP_STATUS.BAD_REQUEST,
          meta
        )
      })
    }
  }

  return { ...updatedCampaign, medias }
}

async function deleteCampaign(id: string): Promise<void> {
  const allMedias = await getMediasBy({ campaignId: id })
  if (allMedias.length) {
    const promises = allMedias.map((media) => deleteMedia(media.id))
    await Promise.all(promises).catch((error: any) => {
      const meta = error.meta || error.message
      throw new CustomError(
        'Error to delete campaign media',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        meta
      )
    })
  }

  await repository.delete(id).catch((error: any) => {
    const meta = error.meta || error.message
    throw new CustomError(
      'Error to delete campaign',
      HTTP_STATUS.BAD_REQUEST,
      meta
    )
  })
}

export {
  createCampaign,
  getCampaignById,
  getAllCampaigns,
  updateCampaign,
  deleteCampaign
}
