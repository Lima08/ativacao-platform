import CustomError from 'constants/errors/CustoError'
import dotenv from 'dotenv'
import type {
  IUser,
  IUserCreated,
  IUserFilter,
  IUserModifier
} from 'interfaces/entities/user'
import { prisma } from 'lib/prisma'
import { User } from 'models/User'

dotenv.config()
const repository = User.of(prisma)

async function createUser(params: IUser): Promise<void> {
  try {
    await repository.create(params)
  } catch (error) {
    throw new CustomError('Error to create user', 400, error)
  }
}

async function getUsers(filter: IUserFilter): Promise<IUserCreated[]> {
  try {
    const users = await repository.getAll(filter)
    return users
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error to get users', 400, meta)
  }
}

async function getUserById(id: string): Promise<IUserCreated> {
  try {
    const user = await repository.getOneBy(id)
    return user
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError(`Error to get user`, 400, meta)
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
    const meta = error.meta
    throw new CustomError(`Error to update user`, 400, meta)
  }
}

async function deleteUser(id: string): Promise<void> {
  try {
    await repository.delete(id)
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError(`Error to delete user`, 400, meta)
  }
}

export { createUser, getUsers, updateUser, deleteUser, getUserById }
