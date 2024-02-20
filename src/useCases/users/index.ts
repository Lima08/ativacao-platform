import bcrypt from 'bcryptjs'
import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import ERROR_CATEGORY from 'constants/ERROR_CATEGORY'
import dotenv from 'dotenv'
import CustomError from 'errors/CustomError'
import { readFileSync } from 'fs'
import type {
  IUser,
  IUserCreated,
  IUserFilter,
  IUserModifier
} from 'interfaces/entities/user'
import jwt from 'jsonwebtoken'
import { prisma } from 'lib/prisma'
import { User } from 'models/User'
import path from 'path'
import EmailService from 'services/emailService/EmailService'
import { getCompanyById, getCompanyBy } from 'useCases/companies'

export interface IUserLoginResponse {
  id: string
  name: string
  email: string
  role: number
  isActive: boolean
  imageUrl?: string
}

export interface ICompanyLoginResponse {
  id: string
  name: string
  slug: string
  imageUrl?: string | null
}

export interface ILoginResponse {
  token: string
  user: IUserLoginResponse
  company: ICompanyLoginResponse
}

dotenv.config()
const repository = User.of(prisma)

// OBS: O parâmetro companyId, para criação de usuário, pode ser o slug da company ou o id
async function createUser(params: IUser): Promise<void> {
  try {
    const user = await repository.getOneBy({ email: params.email })
    if (user) {
      throw new CustomError(
        ERROR_CATEGORY.USERS.CREATE.MESSAGE,
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CATEGORY.USERS.CREATE.CODE
      )
    }

    const company = await getCompanyBy(params.companyId).catch((error) => {
      throw new CustomError(
        ERROR_CATEGORY.COMPANY.NOT_FOUND.MESSAGE,
        HTTP_STATUS.BAD_REQUEST,
        { errorCodeMap: ERROR_CATEGORY.COMPANY.NOT_FOUND.CODE, ...error }
      )
    })

    const newUser = await repository.create({
      ...params,
      companyId: company.id
    })

    if (!newUser) {
      throw new Error('Error to create user')
    }

    const emailTemplatePath = path.resolve('src/templates/welcome.html')
    const emailTemplate = readFileSync(emailTemplatePath, 'utf-8')
    EmailService.getInstance()
      .sendEmail(newUser.email, 'Seja bem vindo!', emailTemplate)
      .catch((error) => {
        console.error(error)
      })
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Erro ao criar usuário',
      error.code || HTTP_STATUS.BAD_REQUEST,
      error
    )
  }
}

async function loginUser({
  email,
  password
}: {
  email: string
  password: string
}): Promise<ILoginResponse> {
  try {
    const user = await repository.getOneBy({ email })
    if (!user) {
      throw new CustomError(
        ERROR_CATEGORY.USERS.NOTE_FOUND.MESSAGE,
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CATEGORY.USERS.NOTE_FOUND.CODE
      )
    }

    if (!user.isActive) {
      throw new CustomError(
        ERROR_CATEGORY.USERS.NON_ACTIVE.MESSAGE,
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CATEGORY.USERS.NON_ACTIVE.CODE
      )
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch && password !== user.password) {
      throw new CustomError(
        ERROR_CATEGORY.USERS.LOGIN.MESSAGE,
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CATEGORY.USERS.LOGIN.CODE
      )
    }

    const token = jwt.sign(
      {
        user: {
          userId: user.id,
          role: user.role,
          companyId: user.companyId
        }
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1d'
      }
    )

    const company = await getCompanyById(user.companyId)

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        imageUrl: user.imageUrl
      },
      company
    }
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Erro ao realizar login. Entre em contato com o suporte',
      error.code || HTTP_STATUS.BAD_REQUEST,
      error
    )
  }
}

async function getUsers(filter: IUserFilter): Promise<IUserCreated[]> {
  try {
    const users = await repository.getAll(filter)
    const usersToReturn = users.map(
      ({ id, email, createdAt, imageUrl, name, isActive, role, companyId }) =>
        ({
          id,
          email,
          createdAt,
          imageUrl,
          name,
          isActive,
          role,
          companyId
        } as IUserCreated)
    )
    return usersToReturn
  } catch (error: any) {
    throw new CustomError(
      error.message ||
        'Erro ao buscar usuários. Entre em contato com o suporte',
      error.code || HTTP_STATUS.BAD_REQUEST,
      error
    )
  }
}

async function getUserById(id: string): Promise<IUserCreated> {
  try {
    const user = await repository.getOneBy({ id })
    return user
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Erro ao buscar usuário. Entre em contato com o suporte',
      error.code || HTTP_STATUS.BAD_REQUEST,
      error
    )
  }
}

async function updateUser(
  id: string,
  params: IUserModifier
): Promise<IUserCreated> {
  try {
    if (params.companyId) {
      const company = await getCompanyById(params.companyId).catch((error) => {
        throw new CustomError(
          ERROR_CATEGORY.COMPANY.NOT_FOUND.MESSAGE,
          HTTP_STATUS.BAD_REQUEST,
          { errorCodeMap: ERROR_CATEGORY.COMPANY.NOT_FOUND.CODE, ...error }
        )
      })
      if (!company) {
        throw new CustomError(
          ERROR_CATEGORY.COMPANY.NOT_FOUND.MESSAGE,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_CATEGORY.COMPANY.NOT_FOUND.CODE
        )
      }
    }

    const updatedUser = await repository.update(id, params)

    if (!updatedUser.isActive && params.isActive) {
      const emailTemplatePath = path.resolve(
        'src/templates/unblockAccount.html'
      )
      const emailTemplate = readFileSync(emailTemplatePath, 'utf-8')
      await EmailService.getInstance().sendEmail(
        updatedUser.email,
        'Conta liberada!',
        emailTemplate
      )
    }

    return updatedUser
  } catch (error: any) {
    throw new CustomError(
      error.message ||
        'Erro ao atualizar usuário. Entre em contato com o suporte',
      error.code || HTTP_STATUS.BAD_REQUEST,
      error
    )
  }
}

async function deleteUser(id: string): Promise<void> {
  try {
    await repository.delete(id)
  } catch (error: any) {
    throw new CustomError(
      error.mesasge ||
        'Erro ao deletar usuário. Entre em contato com o suporte',
      error.code || HTTP_STATUS.BAD_REQUEST,
      error
    )
  }
}

export { createUser, loginUser, getUsers, updateUser, deleteUser, getUserById }
