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
  createTraining: async (newTraining: CreatePayloadStore) => {
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
  updateTraining: async (id: string, updatedTraining: modifierTrainingDto) => {
    try {
      const response = await httpServices.trainings.update(id, updatedTraining)
      set((state) => ({
        ...state,
        trainingsList: state.trainingsList.map((c) =>
          c.id === id ? (response.data as ITrainingCreated) : c
        )
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  handleTrainingActive: async (id: string, status: boolean) => {
    try {
      const response = await httpServices.trainings.update(id, {
        active: status
      })
      set((state) => ({
        ...state,
        trainingsList: state.trainingsList.map((c) =>
          c.id === id ? (response.data as ITrainingCreated) : c
        )
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  deleteTraining: async (id: string) => {
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
