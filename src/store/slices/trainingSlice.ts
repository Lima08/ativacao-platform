import { ITrainingCreated } from 'interfaces/entities/training'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import { modifierTrainingDto } from 'useCases/trainings/dto'
import { StateCreator } from 'zustand'

import { CreatePayloadStore, ITrainingStore } from '../types/iTrainingStore'

const createTrainingsSlice: StateCreator<ITrainingStore> = (set) => ({
  currentTraining: null,
  trainingsList: [],
  resetCurrentTraining: () => set(() => ({ currentTraining: null })),
  getTrainingById: async (id) => {
    useGlobalStore.getState().setLoading(true)

    const response = await httpServices.trainings.getById(id)
    if (response && response.error) {
      useGlobalStore.getState().setError(response.error)
      return
    }

    set((state) => ({
      ...state,
      currentTraining: response?.data
    }))

    useGlobalStore.getState().setLoading(false)
  },
  getAllTrainings: async () => {
    useGlobalStore.getState().setLoading(true)

    const response = await httpServices.trainings.getAll()
    if (response && response.error) {
      useGlobalStore.getState().setError(response.error)
      return
    }
    set((state) => ({
      ...state,
      trainingsList: response?.data
    }))
    useGlobalStore.getState().setLoading(false)
  },
  createTraining: async (newTraining: CreatePayloadStore) => {
    useGlobalStore.getState().setLoading(true)

    const response = await httpServices.trainings.create(newTraining)
    if (response && response.error) {
      useGlobalStore.getState().setError(response.error)
      return
    }
    if (response && response.error) {
      set((state) => ({
        ...state
      }))
      return
    }

    if (response && response.data) {
      set((state) => ({
        ...state,
        trainingsList: [
          ...state.trainingsList,
          response.data as ITrainingCreated
        ]
      }))
    }
    useGlobalStore.getState().setLoading(false)
  },
  updateTraining: async (id: string, updatedTraining: modifierTrainingDto) => {
    useGlobalStore.getState().setLoading(true)

    const response = await httpServices.trainings.update(id, updatedTraining)
    if (response && response.error) {
      useGlobalStore.getState().setError(response.error)
      return
    }
    if (response && response.error) {
      set((state) => ({
        ...state
      }))
      return
    }

    if (response && response.data) {
      set((state) => ({
        ...state,
        trainingsList: state.trainingsList.map((c) =>
          c.id === id ? (response.data as ITrainingCreated) : c
        )
      }))
    }
    useGlobalStore.getState().setLoading(false)
  },
  handleTrainingActive: async (id: string, status: boolean) => {
    useGlobalStore.getState().setLoading(true)

    const response = await httpServices.trainings.update(id, { active: status })
    if (response && response.error) {
      useGlobalStore.getState().setError(response.error)
      return
    }
    if (response && response.error) {
      set((state) => ({
        ...state
      }))
    }

    if (response && response.data) {
      set((state) => ({
        ...state,
        trainingsList: state.trainingsList.map((c) =>
          c.id === id ? (response.data as ITrainingCreated) : c
        )
      }))
    }
    useGlobalStore.getState().setLoading(false)
  },
  deleteTraining: async (id: string) => {
    useGlobalStore.getState().setLoading(true)

    set((state) => ({
      ...state,
      trainingsList: state.trainingsList.filter((c) => c.id !== id)
    }))

    await httpServices.trainings.delete(id)
    useGlobalStore.getState().setLoading(false)
  }
})

export default createTrainingsSlice
