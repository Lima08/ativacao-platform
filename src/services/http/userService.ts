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
  update: async (
    id,
    { name, imageUrl, isActive, password, role, companyId }
  ) => {
    const response = await httpClient.put(`/api/users/${id}`, {
      name,
      imageUrl,
      isActive,
      password,
      role,
      companyId
    })

    return response.data
  }
})

export default UserService
