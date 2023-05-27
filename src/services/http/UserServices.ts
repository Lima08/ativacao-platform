import { AxiosInstance } from 'axios'
import { IUserCreated } from 'interfaces/entities/user'
import { ILoginResponse } from 'useCases/users'

import { ApiResponse } from '../../../types'

type CreatePayload = {
  companyId: string
  name: string
  email: string
  password: string
}

// type ModifierPayload = {
//   name?: string
//   password?: string
//   isActive?: boolean
//   imageUrl?: string
//   role?: number
// }

export interface UserServiceInterface {
  create(payload: CreatePayload): Promise<ApiResponse<void>>
  login(
    payload: Pick<CreatePayload, 'email' | 'password'>
  ): Promise<ApiResponse<ILoginResponse>>
  getAll(): Promise<ApiResponse<IUserCreated[]>>
  // update(
  //   UserId: string,
  //   payload: ModifierPayload
  // ): Promise<ApiResponse<IUserCreated>>
  // delete(userId: string): Promise<void>
}

const UserService = (httpClient: AxiosInstance): UserServiceInterface => ({
  create: async ({ companyId, name, email, password }) => {
    const response = await httpClient.post('/api/users/create', {
      companyId,
      name,
      email,
      password
    })

    return response.data
  },
  login: async ({ email, password }) => {
    const response = await httpClient.post('/api/login', {
      email,
      password
    })

    return response.data
  },
  getAll: async () => {
    const response = await httpClient.get('/api/users/getAll')
    return response.data
  }

  // update: async (UserId, { name, description, active, mediaIds }) => {
  //     const response = await httpClient.put(`/api/users/${UserId}`, {
  //       name,
  //       description,
  //       active,
  //       mediaIds
  //     })

  //     return response.data
  // },

  // delete: async (userId: string) => {
  //   await httpClient.delete(`/api/users/${userId}`)
  // }
})

export default UserService
