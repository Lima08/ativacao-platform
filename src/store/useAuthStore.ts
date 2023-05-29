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
  setUserLogged: (userLogged: ILoginResponse) => void
  setCompany: (company: ILoginResponse['company']) => void
}

export const useAuthStore = create(
  persist(
    (set) => ({
      company: null,
      user: null,
      setUserLogged: (user: ILoginResponse) =>
        set((state: IAuthStore) => ({ ...state, user })),
      setCompany: (company: ILoginResponse['company']) =>
        set((state: IAuthStore) => ({ ...state, company }))
    }),
    {
      name: 'user-logged'
    }
  )
)
