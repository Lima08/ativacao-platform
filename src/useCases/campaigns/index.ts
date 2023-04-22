import { prisma } from 'lib/prisma'
import { Campaign } from 'models/Campaign'
import { updateMedia, getMediasBy } from '../media'
import CustomError from 'constants/errors/CustoError'
import { ICampaignCreated, ICampaignFilter } from 'interfaces/entities/campaign'
import { createdCampaignDto, newCampaignDto, modifierCampaignDto } from './dto'
import { IMediaCreated } from 'interfaces/entities/media'

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
      const meta = error.meta
      throw new CustomError('Error creating campaign', 400, meta)
    })

  let medias: IMediaCreated[] = []

  if (newCampaign && !!mediaIds?.length) {
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
    const newCampaigns = await repository.getAll(filter)
    return newCampaigns
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error to get campaigns', 500, meta)
  }
}

async function updateCampaign(
  id: string,
  { name, description, mediaIds }: modifierCampaignDto
): Promise<createdCampaignDto> {
  const updatedCampaign = await repository
    .update(id, { name, description })
    .catch((error: any) => {
      const meta = error.meta
      throw new CustomError('Error to update campaign', 400, meta)
    })

  let medias: IMediaCreated[] = []

  if (!!mediaIds?.length) {
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
  try {
    await repository.delete(id)
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error to delete campaign', 400, meta)
  }
}

export {
  createCampaign,
  getCampaignById,
  getAllCampaigns,
  updateCampaign,
  deleteCampaign
}
