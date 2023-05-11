import { NextApiRequest } from 'next'

declare module 'next' {
  export interface NextApiRequestCustom extends NextApiRequest {
    files?: any,
    type?: any,
    companyId?: string,
    userId?: string
  }
}
