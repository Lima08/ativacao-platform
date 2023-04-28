import type { IMedia } from './IMedia'

export interface IMediaCreated extends IMedia {
  id: string
  createdAt?: Date
  updatedAt?: Date
}
