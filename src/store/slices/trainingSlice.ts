import { StateCreator } from 'zustand'
import httpServices from 'services/http'
import {
  CreatePayloadStore,
  ITraining,
  ITrainingStore
} from '../types/iTrainingStore'
import { ITrainingCreated } from 'interfaces/entities/training'

const createTrainingsSlice: StateCreator<ITrainingStore> = (set) => ({
  currentTraining: null,
  TrainingsList: [],
  loading: false,
  error: null,
  setLoading: (isLoading) => set(() => ({ loading: isLoading })),
  resetCurrentTraining: () => set(() => ({ currentTraining: null })),
  getTrainingById: async (id) => {
    set({ loading: true })

    const response = await httpServices.trainings.getById(id)
    set((state) => ({
      ...state,
      loading: false,
      currentTraining: response.data,
      error: response.error
    }))
  },
  getAllTrainings: async () => {
    set({ loading: true })
    
    const response = await httpServices.trainings.getAll()
    console.log({responseData: response })
    set((state) => ({
      ...state,
      loading: false,
      trainingsList: response.data,
      error: response.error
    }))
  },
  createTraining: async (newTraining: CreatePayloadStore) => {
    set({ loading: true })

    const response = await httpServices.trainings.create(newTraining)
    set((state) => ({
      ...state,
      loading: false,
      error: response.error,
      trainingsList: [...state.TrainingsList, response.data as ITrainingCreated]
    }))
  },
  updateTraining: async (id: string, updatedTraining: CreatePayloadStore) => {
    set({ loading: true })

    const response = await httpServices.trainings.update(id, updatedTraining)
    set((state) => ({
      ...state,
      loading: false,
      error: response.error,
      trainingsList: state.TrainingsList.map((c) =>
        c.id === id ? (response.data as ITrainingCreated) : c
      )
    }))
  },
  deleteTraining: async (id: string) => {
    set({ loading: true })

    await httpServices.trainings.delete(id)
    set((state) => ({
      ...state,
      loading: false,
      trainingsList: state.TrainingsList.filter((c) => c.id !== id)
    }))
  }
})

export default createTrainingsSlice
