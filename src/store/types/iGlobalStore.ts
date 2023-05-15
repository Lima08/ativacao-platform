export interface IGlobalStore {
  loading: boolean
  error: any
  setLoading: (isLoading: boolean) => void
}
