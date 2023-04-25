'use client'

import { createContext, useContext, useState } from 'react'

export interface ICampaign {
  id: string
  name: string
  description: string
  userId?: string
  companyId?: string
  createdAt?: string
  updatedAt?: string
}

export type CampaignsContextType = {
  state: ICampaign[]
  setCampaign: (params: ICampaign) => void
}

interface CampaignsContextProviderProps {
  children: React.ReactNode
  listCampaigns: ICampaign[]
}

const initialState = {
  state: [],
  setCampaign: (params: ICampaign) => {}
  // currentCampaign: null
  // createCampaign: (params: ICampaign) => {},
  // updateCampaign: () => {},
  // deleteCampaign: () => {},
  // save: () => {},
}

const CampaignsContext =
  createContext<CampaignsContextType>(initialState)

export function CampaignsContextProvider({
  children,
  listCampaigns
}: CampaignsContextProviderProps) {
  const [data, setData] = useState<ICampaign[]>(listCampaigns)

  function handleSetCampaign({
    name,
    description,
    userId,
    companyId,
    id
  }: ICampaign) {
    setData((prev) => {
      return [...prev, { id, name, description, userId, companyId }]
    })
  }

  return (
    <CampaignsContext.Provider
      value={{
        state: data,
        setCampaign: handleSetCampaign
      }}
    >
      {children}
    </CampaignsContext.Provider>
  )
}

export const useCampaignsContext = () => useContext(CampaignsContext)
