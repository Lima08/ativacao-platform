import { create } from 'zustand'
import createCampaignsSlice from './slices/campaignSlice'
import { ICampaignStore } from './types/iCampaignStore'

import createTrainingsSlice from './slices/trainingSlice'
import { ITrainingStore } from './types/iTrainingStore'

const Campaign = create<ICampaignStore>((...a) => ({
  ...createCampaignsSlice(...a)
}))

const Training = create<ITrainingStore>((...a) => ({
  ...createTrainingsSlice(...a)
}))

export default {
  Campaign,
  Training
}