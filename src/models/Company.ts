import type { PrismaClient } from '@prisma/client'
import {
  ICompany,
  ICompanyCreated,
  ICompanyFilter,
  ICompanyModifier
} from 'interfaces/entities/company'

export class Company {
  private repository: PrismaClient
  private static instance: Company

  constructor(connect: PrismaClient) {
    this.repository = connect
  }

  static of(client: PrismaClient): Company {
    if (!this.instance) {
      this.instance = new Company(client)
    }
    return this.instance
  }

  async create(data: ICompany): Promise<ICompanyCreated> {
    const newCompany = await this.repository.Company.create({
      data
    })
    return newCompany
  }

  async getAll(filter: ICompanyFilter): Promise<ICompanyCreated[]> {
    if (filter.adminId) {
      Object.assign(filter, {
        AdminCompany: {
          some: {
            adminId: filter.adminId
          }
        }
      })
      delete filter.adminId
    }
    const allCompanies = await this.repository.Company.findMany({
      where: filter,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return allCompanies
  }

  async getOneBy(id: string): Promise<ICompanyCreated> {
    try {
      const foundedCompany = await this.repository.Company.findUnique({
        where: { id }
      })

      return foundedCompany
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  async getOneBySlug(slug: string): Promise<ICompanyCreated> {
    try {
      const foundedCompany = await this.repository.Company.findUnique({
        where: { slug }
      })

      return foundedCompany
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  async update(
    id: string,
    modifier: ICompanyModifier
  ): Promise<ICompanyCreated> {
    const updatedCompany = await this.repository.Company.update({
      where: { id },
      data: modifier
    })
    return updatedCompany
  }

  async delete(id: string): Promise<void> {
    await this.repository.Company.delete({
      where: { id }
    })
  }
}
