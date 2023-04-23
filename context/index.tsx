import { createContext } from 'react'

export interface INewItem {
  elementId: number
  itemTitle: string
  itemDescription: string
  imgSource?: string
  imgAlt?: string
}

export type CampaignsContextType = {
  state: INewItem[]
  setState: CallableFunction
}

export const CampaignsContext = createContext<CampaignsContextType>({
  state: [],
  setState: (x: any) => x
})
