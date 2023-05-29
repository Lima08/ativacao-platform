import bcrypt from 'bcryptjs'
import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
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
import EmailService from 'services/emailService/IEmailService'
import { getCompanyById } from 'useCases/companies'

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

async function createUser(params: IUser): Promise<void> {
  try {
    const user = await repository.getOneBy({ email: params.email })
    if (user) {
      throw new Error('Email already in use')
    }

    const newUser = await repository.create(params)

    if (!newUser) {
      throw new Error('Error to create user')
    }

    const emailTemplatePath = path.resolve('templates/welcome.html')
    const emailTemplate = readFileSync(emailTemplatePath, 'utf-8')
    await EmailService.getInstance().sendEmail(
      'joaopaulo.gomeslima8@gmail.com',
      'Seja bem vindo!',
      emailTemplate
    )
  } catch (error: any) {
    const message = error?.message || 'Error to create user'
    throw new CustomError(
      'Error to create user',
      HTTP_STATUS.BAD_REQUEST,
      message
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
      throw new Error('User not found')
    }

    if (!user.isActive) {
      throw new Error(
        'This user is not active. Please contact the administrator'
      )
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw new Error('Email or password invalid')
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
    const message = error?.message || 'Error to login user'
    throw new CustomError(message, HTTP_STATUS.BAD_REQUEST, error)
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
    const meta = error.meta || error.message
    throw new CustomError('Error to get users', HTTP_STATUS.BAD_REQUEST, meta)
  }
}

async function getUserById(id: string): Promise<IUserCreated> {
  try {
    const user = await repository.getOneBy({ id })
    return user
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError(`Error to get user`, HTTP_STATUS.BAD_REQUEST, meta)
  }
}

async function updateUser(
  id: string,
  params: IUserModifier
): Promise<IUserCreated> {
  try {
    const updatedUser = await repository.update(id, params)

    if (!!updatedUser && params.isActive) {
      const emailTemplatePath = path.resolve('templates/unblockAccount.html')
      const emailTemplate = readFileSync(emailTemplatePath, 'utf-8')
      await EmailService.getInstance().sendEmail(
        updatedUser.email,
        'Conta liberada!',
        emailTemplate
      )
    }

    return updatedUser
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError(`Error to update user`, HTTP_STATUS.BAD_REQUEST, meta)
  }
}

async function deleteUser(id: string): Promise<void> {
  try {
    await repository.delete(id)
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError(`Error to delete user`, HTTP_STATUS.BAD_REQUEST, meta)
  }
}

export { createUser, loginUser, getUsers, updateUser, deleteUser, getUserById }
