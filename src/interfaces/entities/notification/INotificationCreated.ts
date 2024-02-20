import type { INotification } from './INotification'

export interface INotificationCreated extends INotification {
  id: string
  createdAt: Date
  updatedAt: Date
}
