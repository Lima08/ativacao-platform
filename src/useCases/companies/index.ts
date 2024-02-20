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

async function createCompany(
  adminId: string,
  { name, slug, imageUrl }: ICompany
): Promise<ICompanyCreated> {
  try {
    const companyAlreadyExists = await repository.getOneBySlug(slug)

    if (companyAlreadyExists) {
      throw new CustomError(
        'Já existe uma empresa com esse slug!',
        HTTP_STATUS.BAD_REQUEST
      )
    }

    const createdCompany = await repository.create({
      name,
      slug,
      imageUrl
    })

    await prisma.adminCompany.create({
      data: {
        adminId,
        companyId: createdCompany.id
      }
    })

    return createdCompany
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error ao criar empresa',
      error.code || HTTP_STATUS.BAD_REQUEST,
      error
    )
  }
}

async function getCompanyById(id: string): Promise<ICompanyCreated> {
  try {
    const company = await repository.getOneBy(id)
    return company
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error to get company',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    )
  }
}

async function getCompanyBy(
  companyIdentifier: string
): Promise<ICompanyCreated> {
  let companyBySlug: any = {}
  let companyById: any = {}
  const error: any = null
  companyBySlug = await repository.getOneBySlug(companyIdentifier)
  companyById = await repository.getOneBy(companyIdentifier)

  if ((!companyBySlug && !companyById) || error) {
    throw new CustomError('Company not found', HTTP_STATUS.NOT_FOUND, error)
  }

  return companyBySlug || companyById
}

async function getAllCompanies(
  filter: ICompanyFilter
): Promise<ICompanyCreated[]> {
  try {
    const allCompanies = await repository.getAll(filter)
    return allCompanies
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error to get companies',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
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
    throw new CustomError(
      error.message || 'Error to get companies',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    )
  }
}

export {
  createCompany,
  getCompanyById,
  getAllCompanies,
  updateCompany,
  getCompanyBy
}
