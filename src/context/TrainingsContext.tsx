'use client'

import { createContext, useContext, useState } from 'react'

export interface ITraining {
  id: string
  name: string
  description: string
  active: boolean
  userId?: string
  companyId?: string
  createdAt?: string
  updatedAt?: string
}

export type TrainingsContextType = {
  state: ITraining[]
  setTraining: (params: ITraining) => void
}

interface TrainingsContextProviderProps {
  children: React.ReactNode
  listTrainings: ITraining[]
}

const initialState = {
  state: [],
  setTraining: (params: ITraining) => {}
  // currentTraining: null
  // createTraining: (params: ITraining) => {},
  // updateTraining: () => {},
  // deleteTraining: () => {},
  // save: () => {},
}

const TrainingsContext = createContext<TrainingsContextType>(initialState)

export function TrainingsContextProvider({
  children,
  listTrainings
}: TrainingsContextProviderProps) {
  const [data, setData] = useState<ITraining[]>(listTrainings)

  function handleSetTraining({
    id,
    userId,
    companyId,
    name,
    description,
    active
  }: ITraining) {
    setData((prev) => {
      return [...prev, { id, name, description, userId, companyId, active }]
    })
  }

  return (
    <TrainingsContext.Provider
      value={{
        state: data,
        setTraining: handleSetTraining
      }}
    >
      {children}
    </TrainingsContext.Provider>
  )
}

export const useTrainingsContext = () => useContext(TrainingsContext)
