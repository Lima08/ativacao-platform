import { IUserCreated, IUserModifier } from 'interfaces/entities/user'

export interface IUserStore {
  currentUser: IUserCreated | null
  usersList: IUserCreated[]
  resetCurrentUser: () => void
  // createUser: (newUser: CreatePayloadStore) => void
  getUserById: (id: string) => void
  getAllUsers: () => void
  // deleteUser: (id: string) => void
  updateUser: (id: string, updatedUser: IUserModifier) => void
}
