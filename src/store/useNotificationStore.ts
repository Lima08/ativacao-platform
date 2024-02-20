import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface INotificationViewed {
  notificationsViewed: string[]
  setNotificationsViewed: (notificationId: string) => void
}

export const useNotificationStore = create(
  persist(
    (set) => ({
      notificationsViewed: [],
      setNotificationsViewed: (notificationId: string) =>
        set((state: INotificationViewed) => {
          const notificationsViewed = state.notificationsViewed
            ? [...state.notificationsViewed, notificationId]
            : [notificationId]

          return { ...state, notificationsViewed }
        })
    }),
    {
      name: 'notifications'
    }
  )
)
