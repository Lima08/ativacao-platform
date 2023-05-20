import { PrismaClient } from '@prisma/client'
import {
  IAnalysis,
  IAnalysisCreated,
  IAnalysisFilter,
  IAnalysisModifier
} from 'interfaces/entities/analysis'

export class Analysis {
  private repository: PrismaClient
  private static instance: Analysis

  constructor(connect: PrismaClient) {
    this.repository = connect
  }

  static of(client: PrismaClient): Analysis {
    if (!this.instance) {
      this.instance = new Analysis(client)
    }
    return this.instance
  }

  async create(data: IAnalysis): Promise<IAnalysisCreated> {
    const newAnalysis = await this.repository.analysis.create({
      data
    })
    return newAnalysis
  }

  async getAll(filter: IAnalysisFilter): Promise<IAnalysisCreated[]> {
    const allAnalyzes = await this.repository.analysis.findMany({
      where: filter
    })

    return allAnalyzes
  }

  async getOneBy(id: string): Promise<IAnalysisCreated> {
    try {
      const foundedAnalysis = await this.repository.analysis.findUnique({
        where: { id }
      })

      return foundedAnalysis
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  async update(
    id: string,
    modifier: IAnalysisModifier
  ): Promise<IAnalysisCreated> {
    const updatedAnalysis = await this.repository.analysis.update({
      where: { id },
      data: modifier
    })
    return updatedAnalysis
  }

  async delete(id: string): Promise<void> {
    await this.repository.analysis.delete({
      where: { id }
    })
  }
}
