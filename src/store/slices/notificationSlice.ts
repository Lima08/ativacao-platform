import {
  INotification,
  INotificationCreated,
  INotificationModifier
} from 'interfaces/entities/notification'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import { StateCreator } from 'zustand'

export interface INotificationStore {
  currentNotification: INotificationCreated | null
  notificationsList: INotificationCreated[] | null
  setCurrentNotification: (notification: INotificationCreated) => void
  resetNotificationState: () => void
  resetCurrentNotification: () => void
  createNotification: (newNotification: INotification) => void
  getNotificationById: (id: string) => void
  getAllNotifications: () => void
  deleteNotification: (id: string) => void
  updateNotification: (
    id: string,
    updatedNotification: INotificationModifier
  ) => void
}

const createNotificationsSlice: StateCreator<INotificationStore> = (set) => ({
  currentNotification: null,
  notificationsList: null,
  resetNotificationState: () => {
    set(() => ({ notificationsList: null, currentNotification: null }))
  },
  setCurrentNotification: (notification) => {
    set((state) => ({ ...state, currentNotification: notification }))
  },
  resetCurrentNotification: () => {
    set((state) => ({ ...state, currentNotification: null }))
  },
  getNotificationById: async (id) => {
    if (!id) return

    useGlobalStore.getState().setLoading(true)
    useGlobalStore.getState().setError(null)

    try {
      const response = await httpServices.notifications.getById(id)

      if (!response.data?.id) {
        useGlobalStore.getState().setToaster({
          isOpen: true,
          message: 'Notificação não encontrada!',
          type: 'warning'
        })
        return
      }

      set((state) => ({
        ...state,
        currentNotification: response?.data
      }))
    } catch (error) {
      console.error(error)
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Error ao buscar notificação!',
        type: 'error'
      })
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  getAllNotifications: async () => {
    useGlobalStore.getState().setLoading(true)
    try {
      const response = await httpServices.notifications.getAll()
      set((state) => ({
        ...state,
        notificationsList: response?.data
      }))
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao buscar notificações!',
        type: 'error'
      })
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  createNotification: async (newNotification) => {
    try {
      useGlobalStore.getState().setLoading(true)
      useGlobalStore.getState().setError(null)

      const response = await httpServices.notifications.create(newNotification)
      set((state) => {
        const allNotifications = state.notificationsList || []
        allNotifications.unshift(response.data as INotificationCreated)
        return { ...state, notificationsList: allNotifications }
      })
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'notificação criada com sucesso!',
        type: 'success'
      })
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao criar notificação!',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  updateNotification: async (id, updatedNotification) => {
    useGlobalStore.getState().setLoading(true)

    set((state) => ({
      ...state,
      notificationsList:
        state.notificationsList &&
        state.notificationsList.map((notification) => {
          if (notification.id !== id) return notification

          return {
            ...notification,
            ...updatedNotification
          }
        })
    }))
    try {
      const response = await httpServices.notifications.update(
        id,
        updatedNotification
      )

      if (response.data?.id) {
        useGlobalStore.getState().setToaster({
          isOpen: true,
          message: 'notificação atualizada com sucesso!',
          type: 'success'
        })
      }
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao atualizar notificação!',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },

  deleteNotification: async (id) => {
    useGlobalStore.getState().setError(null)

    try {
      set((state) => ({
        ...state,
        notificationsList:
          state.notificationsList &&
          state.notificationsList.filter(
            (notification) => notification.id !== id
          )
      }))

      await httpServices.notifications.delete(id)
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao  deletar notificação!',
        type: 'error'
      })
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  }
})

export default createNotificationsSlice
