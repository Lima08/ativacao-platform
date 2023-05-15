import { create } from 'zustand'
import createGlobalSlice from './slices/globalSlice'
import createCampaignsSlice from './slices/campaignSlice'
import createTrainingsSlice from './slices/trainingSlice'
import { ICampaignStore } from './types/iCampaignStore'
import { ITrainingStore } from './types/iTrainingStore'
import { IGlobalStore } from './types/iGlobalStore'

const Global = create<IGlobalStore>((...a) => ({
  ...createGlobalSlice(...a)
}))

const Campaign = create<ICampaignStore>((...a) => ({
  ...createCampaignsSlice(...a)
}))

const Training = create<ITrainingStore>((...a) => ({
  ...createTrainingsSlice(...a)
}))

export default {
  Global,
  Campaign,
  Training
}
