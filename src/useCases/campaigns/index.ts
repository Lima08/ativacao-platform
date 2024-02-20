import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import CustomError from 'errors/CustomError'
import { readFileSync } from 'fs'
import { ICampaignCreated, ICampaignFilter } from 'interfaces/entities/campaign'
import { IMediaCreated } from 'interfaces/entities/media'
import { prisma } from 'lib/prisma'
import { Campaign } from 'models/Campaign'
import path from 'path'
import EmailService from 'services/emailService/EmailService'
import { getUsers } from 'useCases/users'

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
      throw new CustomError('Erro ao criar campanha', HTTP_STATUS.BAD_REQUEST)

    let medias: IMediaCreated[] = []
    if (newCampaign && mediaIds?.length) {
      const promises = mediaIds.map((mediaId) =>
        updateMedia(mediaId, { campaignId: newCampaign.id })
      )

      await Promise.all(promises)
        .then((files) => (medias = files))
        .catch((error: any) => {
          throw new CustomError(
            error.message || 'Erro ao criar mídias',
            HTTP_STATUS.BAD_REQUEST,
            error
          )
        })
    }

    const companyUsers = await getUsers({ companyId })
    const userEmailList = companyUsers.map((user) => user.email)

    const emailTemplatePath = path.resolve(
      'src/templates/newContentNotify.html'
    )
    const emailTemplate = readFileSync(emailTemplatePath, 'utf-8')
    const title = 'Novidade no site!'

    const variables = {
      moduleName: 'Campanhas',
      contentName: name,
      contentDescription: description,
      contentUrl: `https://ativacaotec.com/in/campaigns/${newCampaign.id}`
    }

    const compiledEmail = EmailService.getInstance().compileTemplate(
      emailTemplate,
      variables
    )

    await EmailService.getInstance()
      .sendEmailBulk(userEmailList, title, compiledEmail)
      .catch((error) => console.error(error))

    return { ...newCampaign, medias }
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Erro ao criar campanha',
      error.code || HTTP_STATUS.BAD_REQUEST,
      error
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
    throw new CustomError(
      error.message || 'Error to get campaign',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
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
    throw new CustomError(
      error.message || 'Error to get campaigns',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
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
      if (error.message) {
        throw new CustomError(error.message, HTTP_STATUS.BAD_REQUEST, error)
      }
      throw new CustomError(
        'Erro ao atualizar campanha',
        HTTP_STATUS.BAD_REQUEST,
        error
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
        throw new CustomError(
          error.message || 'Erro ao atualizar mídias',
          error.code || HTTP_STATUS.BAD_REQUEST,
          error
        )
      })
  }

  let promisesToExclude: any[] = []
  if (mediasToExclude?.length) {
    promisesToExclude = mediasToExclude.map((id) => deleteMedia(id))
  }

  await Promise.all(promisesToExclude).catch((error: any) => {
    throw new CustomError(
      error.message || 'Erro ao deletar mídia',
      error.code || HTTP_STATUS.BAD_REQUEST,
      error
    )
  })

  return { ...updatedCampaign, medias }
}

async function deleteCampaign(id: string): Promise<void> {
  const allMedias = await getMediasBy({ campaignId: id })
  if (allMedias.length) {
    const promises = allMedias.map((media) => deleteMedia(media.id))
    await Promise.all(promises).catch((error: any) => {
      throw new CustomError(
        error.message || 'Error to delete campaign media',
        error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
        error
      )
    })
  }

  await repository.delete(id).catch((error: any) => {
    throw new CustomError(
      'Erro ao deletar campanha',
      HTTP_STATUS.BAD_REQUEST,
      error
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
