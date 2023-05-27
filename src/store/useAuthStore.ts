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
}

export const useAuthStore = create(
  persist(
    (set) => ({
      company: null,
      user: null,
      setUserLogged: (userLogged: ILoginResponse) =>
        set((state: IAuthStore) => ({ ...state, ...userLogged }))
    }),
    {
      name: 'user-logged'
    }
  )
)
