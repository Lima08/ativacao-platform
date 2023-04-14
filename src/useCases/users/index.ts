import dotenv from 'dotenv'
import { prisma } from 'lib/prisma'
import { User } from 'models/User'
import type {
  IUser,
  IUserCreated,
  IUserModifier
} from 'interfaces/entities/user'

dotenv.config()
const userRepository = User.of(prisma)

async function createUser(params: IUser): Promise<IUserCreated> {
  const users = await userRepository.create(params)
  return users
}

async function getUsers(): Promise<IUserCreated[]> {
  const users = await userRepository.getAll()
  return users
}

async function getUserById(id: string): Promise<IUserCreated> {
  const user = await userRepository.getOneBy({ id })
  return user
}

async function updateUser(
  id: string,
  params: IUserModifier
): Promise<IUserCreated> {
  const updatedUser = await userRepository.update(id, params)
  return updatedUser
}

async function deleteUser(id: string): Promise<void> {
  await userRepository.delete(id)
}

export { createUser, getUsers, updateUser, deleteUser, getUserById }
