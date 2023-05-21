import { ILoginResponse } from 'useCases/users'

export interface IGlobalStore {
  global: Pick<ILoginResponse, 'company' | 'user'>
  loading: boolean
  error: any
  setLoading: (isLoading: boolean) => void
  setError: (error: any) => void
  setGlobal: (global: Pick<ILoginResponse, 'company' | 'user'>) => void
}
