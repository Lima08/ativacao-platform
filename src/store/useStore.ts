import { create } from 'zustand'
import createCampaignsSlice from './slices/campaignSlice'
import { ICampaignStore } from './types/iCampaignStore'

const useStore = create<ICampaignStore>((...a) => ({
  ...createCampaignsSlice(...a)
}))

export default useStore
