import {
  ICompanyLoginResponse,
  ILoginResponse,
  IUserLoginResponse
} from 'useCases/users'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface IAuthStore {
  company: ICompanyLoginResponse | null
  user: IUserLoginResponse | null
  setUser: (userLogged: ILoginResponse['user']) => void
  setCompany: (company: ILoginResponse['company']) => void
}

export const useAuthStore = create(
  persist(
    (set) => ({
      company: null,
      user: null,
      setUser: (user: ILoginResponse['user']) =>
        set((state: IAuthStore) => ({ ...state, user })),
      setCompany: (company: ILoginResponse['company']) =>
        set((state: IAuthStore) => ({ ...state, company }))
    }),
    {
      name: 'user-logged'
    }
  )
)
