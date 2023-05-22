import { AxiosInstance } from 'axios'
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
  // getAll(): Promise<ApiResponse<IUserCreated[]>>
  // update(
  //   UserId: string,
  //   payload: ModifierPayload
  // ): Promise<ApiResponse<IUserCreated>>
}

const UserService = (httpClient: AxiosInstance): UserServiceInterface => ({
  create: async ({ companyId, name, email, password }) => {
    try {
      const response = await httpClient.post('/api/users/create', {
        companyId,
        name,
        email,
        password
      })

      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  },
  login: async ({ email, password }) => {
    try {
      const response = await httpClient.post('/api/login', {
        email,
        password
      })

      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
  // getAll: async () => {
  //   try {
  //     const response = await httpClient.get('/api/Users/getAll')

  //     return response.data
  //   } catch (error) {
  //     console.error('Error fetching Users:', error)
  //     return error
  //   }
  // },

  // update: async (UserId, { name, description, active, mediaIds }) => {
  //   try {
  //     const response = await httpClient.put(`/api/Users/${UserId}`, {
  //       name,
  //       description,
  //       active,
  //       mediaIds
  //     })

  //     return response.data
  //   } catch (error) {
  //     console.error('Error to update User:', error)
  //     return error
  //   }
  // },
})

export default UserService
