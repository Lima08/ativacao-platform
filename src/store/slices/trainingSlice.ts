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
  trainingsList: ITrainingCreated[]
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
  trainingsList: [],
  resetCurrentTraining: () => {
    set(() => ({ currentTraining: null }))
  },
  getTrainingById: async (id) => {
    useGlobalStore.getState().setLoading(true)
    try {
      const response = await httpServices.trainings.getById(id)
      set((state) => ({
        ...state,
        currentTraining: response?.data
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
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
    useGlobalStore.getState().setLoading(true)
    try {
      const response = await httpServices.trainings.create(newTraining)
      set((state) => ({
        ...state,
        trainingsList: [
          ...state.trainingsList,
          response.data as ITrainingCreated
        ]
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  updateTraining: async (id, updatedTraining) => {
    useGlobalStore.getState().setLoading(true)

    set((state) => ({
      ...state,
      trainingsList: state.trainingsList.map((training) =>
        training.id === id ? { ...training, ...updatedTraining } : training
      )
    }))
    try {
      await httpServices.trainings.update(id, updatedTraining)
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  handleTrainingActive: async (id, active) => {
    useGlobalStore.getState().setLoading(true)

    set((state) => ({
      ...state,
      trainingsList: state.trainingsList.map((training) =>
        training.id === id ? { ...training, active } : training
      )
    }))
    try {
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
    useGlobalStore.getState().setLoading(true)
    try {
      set((state) => ({
        ...state,
        trainingsList: state.trainingsList.filter((c) => c.id !== id)
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
