import bcrypt from 'bcryptjs'
import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import dotenv from 'dotenv'
import CustomError from 'errors/CustomError'
import type {
  IUser,
  IUserCreated,
  IUserFilter,
  IUserModifier
} from 'interfaces/entities/user'
import jwt from 'jsonwebtoken'
import { prisma } from 'lib/prisma'
import { User } from 'models/User'

dotenv.config()
const repository = User.of(prisma)

async function createUser(params: IUser): Promise<void> {
  try {
    const user = await repository.getOneBy({ email: params.email })
    if (user) {
      throw new Error('Email already in use')
    }

    await repository.create(params)
  } catch (error: any) {
    const message = error?.message || 'Error to create user'
    throw new CustomError(message, HTTP_STATUS.BAD_REQUEST, error)
  }
}

async function loginUser({
  email,
  password
}: Pick<IUser, 'email' | 'password'>): Promise<string> {
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

    return token
  } catch (error: any) {
    const message = error?.message || 'Error to login user'
    throw new CustomError(message, HTTP_STATUS.BAD_REQUEST, error)
  }
}

async function getUsers(filter: IUserFilter): Promise<IUserCreated[]> {
  try {
    const users = await repository.getAll(filter)
    return users
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
