import { PrismaClient } from '@prisma/client'
import {
  ICampaign,
  ICampaignCreated,
  ICampaignFilter,
  ICampaignModifier
} from 'interfaces/entities/campaign'

export class Campaign {
  private repository: PrismaClient
  private static instance: Campaign

  constructor(connect: PrismaClient) {
    this.repository = connect
  }

  static of(client: PrismaClient): Campaign {
    if (!this.instance) {
      this.instance = new Campaign(client)
    }
    return this.instance
  }

  async create(data: ICampaign): Promise<ICampaignCreated> {
    const newCampaign = await this.repository.campaign.create({
      data
    })
    return newCampaign
  }

  async getAll(filter: ICampaignFilter): Promise<ICampaignCreated[]> {
    const allCampaigns = await this.repository.campaign.findMany({
      where: filter
    })

    return allCampaigns
  }

  async getOneBy(id: string): Promise<ICampaignCreated> {
    try {
      const foundedCampaign = await this.repository.campaign.findUnique({
        where: { id }
      })

      return foundedCampaign
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  async update(
    id: string,
    modifier: ICampaignModifier
  ): Promise<ICampaignCreated> {
    const updatedCampaign = await this.repository.campaign.update({
      where: { id },
      data: modifier
    })
    return updatedCampaign
  }

  async delete(id: string): Promise<void> {
    await this.repository.campaign.delete({
      where: { id }
    })
  }
}
