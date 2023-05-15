import { ITrainingCreated } from 'interfaces/entities/training'
import httpServices from 'services/http'
import { modifierTrainingDto } from 'useCases/trainings/dto'
import { StateCreator } from 'zustand'

import { CreatePayloadStore, ITrainingStore } from '../types/iTrainingStore'

const createTrainingsSlice: StateCreator<ITrainingStore> = (set) => ({
  currentTraining: null,
  trainingsList: [],
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
      currentTraining: response?.data,
      error: response?.error
    }))
  },
  getAllTrainings: async () => {
    set({ loading: true })

    const response = await httpServices.trainings.getAll()
    set((state) => ({
      ...state,
      loading: false,
      trainingsList: response?.data,
      error: response?.error
    }))
  },
  createTraining: async (newTraining: CreatePayloadStore) => {
    set({ loading: true })

    const response = await httpServices.trainings.create(newTraining)
    if (response && response.error) {
      set((state) => ({
        ...state,
        loading: false,
        error: response.error
      }))
      return
    }

    if (response && response.data) {
      set((state) => ({
        ...state,
        loading: false,
        trainingsList: [
          ...state.trainingsList,
          response.data as ITrainingCreated
        ]
      }))
    }
  },
  updateTraining: async (id: string, updatedTraining: modifierTrainingDto) => {
    set({ loading: true })

    const response = await httpServices.trainings.update(id, updatedTraining)
    if (response && response.error) {
      set((state) => ({
        ...state,
        loading: false,
        error: response.error
      }))
      return
    }

    if (response && response.data) {
      set((state) => ({
        ...state,
        loading: false,
        trainingsList: state.trainingsList.map((c) =>
          c.id === id ? (response.data as ITrainingCreated) : c
        )
      }))
    }
  },
  handleTrainingActive: async (id: string, status: boolean) => {
    set({ loading: true })

    const response = await httpServices.trainings.update(id, { active: status })
    if (response && response.error) {
      set((state) => ({
        ...state,
        loading: false,
        error: response.error
      }))
    }

    if (response && response.data) {
      set((state) => ({
        ...state,
        loading: false,
        trainingsList: state.trainingsList.map((c) =>
          c.id === id ? (response.data as ITrainingCreated) : c
        )
      }))
    }
  },
  deleteTraining: async (id: string) => {
    set((state) => ({
      ...state,
      loading: false,
      trainingsList: state.trainingsList.filter((c) => c.id !== id)
    }))

    await httpServices.trainings.delete(id)
  }
})

export default createTrainingsSlice
