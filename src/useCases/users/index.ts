import dotenv from 'dotenv'
import { prisma } from 'lib/prisma'
import { User } from 'models/User'
import type {
  IUser,
  IUserCreated,
  IUserFilter,
  IUserModifier
} from 'interfaces/entities/user'
import CustomError from 'constants/errors/CustoError'

dotenv.config()
const userRepository = User.of(prisma)

async function createUser(params: IUser): Promise<IUserCreated> {
  try {
    const user = await userRepository.create(params)
    return user
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error to create user', 400, meta)
  }
}

async function getUsers(filter: IUserFilter): Promise<IUserCreated[]> {
  try {
    // TODO: Colocar validação se company existe e retornar erro caso não (getCompanyById)
    const users = await userRepository.getAll(filter)
    return users
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error to get users', 400, meta)
  }
}

async function getUserById(id: string): Promise<IUserCreated> {
  try {
    const user = await userRepository.getOneBy(id)
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
    const updatedUser = await userRepository.update(id, params)
    return updatedUser
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError(`Error to update user`, 400, meta)
  }
}

async function deleteUser(id: string): Promise<void> {
  try {
    await userRepository.delete(id)
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError(`Error to delete user`, 400, meta)
  }
}

export { createUser, getUsers, updateUser, deleteUser, getUserById }
