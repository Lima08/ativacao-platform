import { ILoginResponse } from 'useCases/users'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface IAuthStore {
  company: Pick<ILoginResponse, 'company'> | null
  user: Pick<ILoginResponse, 'user'> | null
}

export const useAuthStore = create(
  persist(
    (set) => ({
      company: null,
      user: null,
      setUserLogged: (
        userLogged: Pick<ILoginResponse, 'company' | 'user'> | null
      ) => set((state: IAuthStore) => ({ ...state, ...userLogged }))
    }),
    {
      name: 'user-logged'
    }
  )
)
