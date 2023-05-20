import type { IUser } from './IUser'

export interface IUserCreated extends IUser {
  id: string
  isActive: boolean
  role: number
  createdAt: Date
  updatedAt: Date
}
