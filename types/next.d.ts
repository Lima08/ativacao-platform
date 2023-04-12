import { NextApiRequest } from 'next'

declare module 'next' {
  export interface NextApiRequestWithMulter extends NextApiRequest {
    file: any
  }
}
