import type { IUser } from './IUser'

export interface IUserCreated extends IUser {
  id: string
  createdAt: Date
  updatedAt: Date
}
