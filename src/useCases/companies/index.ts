import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import CustomError from 'errors/CustomError'
import {
  ICompany,
  ICompanyCreated,
  ICompanyFilter,
  ICompanyModifier
} from 'interfaces/entities/company'
import { prisma } from 'lib/prisma'
import { Company } from 'models/Company'

const repository = Company.of(prisma)

async function createCompany({
  name,
  slug,
  imageUrl
}: ICompany): Promise<ICompanyCreated> {
  try {
    const createdCompany = await repository.create({
      name,
      slug,
      imageUrl
    })
    return createdCompany
  } catch (error: any) {
    const message = error?.message || 'Error to create company'
    throw new CustomError(
      'Error to create company',
      HTTP_STATUS.BAD_REQUEST,
      message
    )
  }
}

async function getCompanyById(id: string): Promise<ICompanyCreated> {
  try {
    const company = await repository.getOneBy(id)
    return company
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError(
      'Error to get company',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      meta
    )
  }
}

async function getAllCompanies(
  filter: ICompanyFilter
): Promise<ICompanyCreated[]> {
  try {
    const allCompanies = await repository.getAll(filter)
    return allCompanies
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError(
      'Error to get companies',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      meta
    )
  }
}

async function updateCompany(
  id: string,
  { name, imageUrl, slug }: ICompanyModifier
): Promise<ICompanyCreated> {
  try {
    const updatedCompany = await repository.update(id, { name, imageUrl, slug })
    return updatedCompany
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError(
      'Error to get companies',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      meta
    )
  }
}

export { createCompany, getCompanyById, getAllCompanies, updateCompany }
