import { AxiosInstance } from 'axios'
import { IUserCreated, IUserModifier } from 'interfaces/entities/user'
import { ILoginResponse } from 'useCases/users'

import { ApiResponse } from '../../../types'

type CreatePayload = {
  companyId: string
  name: string
  email: string
  password: string
}

export interface UserServiceInterface {
  create(payload: CreatePayload): Promise<ApiResponse<void>>
  login(
    payload: Pick<CreatePayload, 'email' | 'password'>
  ): Promise<ApiResponse<ILoginResponse>>
  getAll(): Promise<ApiResponse<IUserCreated[]>>
  getById(id: string): Promise<ApiResponse<IUserCreated>>
  update(
    UserId: string,
    payload: IUserModifier
  ): Promise<ApiResponse<IUserCreated>>
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
  },
  getById: async (id) => {
    const response = await httpClient.get(`/api/users/${id}`)
    return response.data
  },
  update: async (id, { name, imageUrl, isActive, password, role }) => {
    console.log('🚀 ~ file: UserServices.ts:56 ~ update: ~ imageUrl:', imageUrl)
    const response = await httpClient.put(`/api/users/${id}`, {
      name,
      imageUrl,
      isActive,
      password,
      role
    })
    console.log('🚀 ~ file: UserServices.ts:59 ~ update: ~ response:', response)

    return response.data
  }

  // delete: async (userId: string) => {
  //   await httpClient.delete(`/api/users/${userId}`)
  // }
})

export default UserService
