import { ITrainingCreated } from 'interfaces/entities/training'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import { modifierTrainingDto } from 'useCases/trainings/dto'
import { StateCreator } from 'zustand'

export interface ITrainingDto {
  name: string
  description: string
  mediaIds: string[]
}

export interface ITrainingStore {
  currentTraining: ITrainingCreated | null
  trainingsList: ITrainingCreated[] | null
  resetTrainingState: () => void
  resetCurrentTraining: () => void
  createTraining: (newTraining: ITrainingDto) => void
  getTrainingById: (id: string) => void
  getAllTrainings: () => void
  deleteTraining: (id: string) => void
  updateTraining: (id: string, updatedTraining: modifierTrainingDto) => void
  handleTrainingActive: (id: string, status: boolean) => void
}

const createTrainingsSlice: StateCreator<ITrainingStore> = (set) => ({
  currentTraining: null,
  trainingsList: null,
  resetTrainingState: () => {
    set(() => ({ trainingsList: null, currentTraining: null }))
  },
  resetCurrentTraining: () => {
    set(() => ({ currentTraining: null }))
  },
  getTrainingById: async (id) => {
    if (!id) return

    useGlobalStore.getState().setLoading(true)
    useGlobalStore.getState().setError(null)

    try {
      const response = await httpServices.trainings.getById(id)

      if (!response.data?.id) {
        useGlobalStore.getState().setToaster({
          isOpen: true,
          message: 'Treinamento não encontrado!',
          type: 'warning'
        })
        return
      }

      set((state) => ({
        ...state,
        currentTraining: response?.data
      }))
    } catch (error) {
      console.error(error)
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Error ao buscar treinamento!',
        type: 'error'
      })
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  getAllTrainings: async () => {
    useGlobalStore.getState().setLoading(true)
    try {
      const response = await httpServices.trainings.getAll()
      set((state) => ({
        ...state,
        trainingsList: response?.data
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  createTraining: async (newTraining) => {
    try {
      useGlobalStore.getState().setLoading(true)
      useGlobalStore.getState().setError(null)

      const response = await httpServices.trainings.create(newTraining)
      set((state) => ({
        ...state,
        trainingsList: state.trainingsList
          ? [...state.trainingsList, response.data as ITrainingCreated]
          : [response.data as ITrainingCreated]
      }))
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Treinamento criado com sucesso!',
        type: 'success'
      })
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message:
          error.message ||
          'Erro ao criar treinamento! Tente novamente ou entre em contato com o suporte.',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  updateTraining: async (id, updatedTraining) => {
    useGlobalStore.getState().setLoading(true)

    try {
      const mediaIds: string[] = []
      if (updatedTraining?.medias) {
        const ids = updatedTraining.medias.map((media) => media.id)
        ids.forEach((id) => {
          mediaIds.push(id)
        })
      }
      if (updatedTraining.mediaIds) {
        updatedTraining.mediaIds.forEach((id) => {
          mediaIds.push(id)
        })
      }

      await httpServices.trainings.update(id, { ...updatedTraining, mediaIds })
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Treinamento atualizado com sucesso!',
        type: 'success'
      })

      set((state) => ({
        ...state,
        trainingsList: null
      }))
    } catch (error) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message:
          'Erro ao atualizar treinamento! Tente novamente ou entre em contato com o suporte.',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  handleTrainingActive: async (id, active) => {
    set((state) => ({
      ...state,
      trainingsList:
        state.trainingsList &&
        state.trainingsList.map((training) =>
          training.id === id ? { ...training, active } : training
        )
    }))
    try {
      useGlobalStore.getState().setError(null)
      useGlobalStore.getState().setLoading(true)

      await httpServices.trainings.update(id, {
        active
      })
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  deleteTraining: async (id) => {
    useGlobalStore.getState().setError(null)

    try {
      set((state) => ({
        ...state,
        trainingsList:
          state.trainingsList && state.trainingsList.filter((c) => c.id !== id)
      }))

      await httpServices.trainings.delete(id)
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  }
})

export default createTrainingsSlice
