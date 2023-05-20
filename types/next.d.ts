import { NextApiRequest } from 'next'

declare module 'next' {
  export interface NextApiRequestCustom extends NextApiRequest {
    files?: any
    type?: string
    user?: {
      userId: string
      role: number
      companyId: string
      iat: number
      exp: number
    }
  }
}
