export type Error = {
  message: string
  meta: Record<string, any>
}

export type ApiResponse<T> = {
  data?: T
  error?: Error | null
}
