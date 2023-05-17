import { create } from 'zustand'

import createAnalysisSlice from './slices/analysisSlice'
import createCampaignsSlice from './slices/campaignSlice'
import createGlobalSlice from './slices/globalSlice'
import createTrainingsSlice from './slices/trainingSlice'
import { IAnalysisStore } from './types/IAnalysisStore'
import { ICampaignStore } from './types/iCampaignStore'
import { IGlobalStore } from './types/iGlobalStore'
import { ITrainingStore } from './types/iTrainingStore'

const Global = create<IGlobalStore>((...a) => ({
  ...createGlobalSlice(...a)
}))

const Campaign = create<ICampaignStore>((...a) => ({
  ...createCampaignsSlice(...a)
}))

const Training = create<ITrainingStore>((...a) => ({
  ...createTrainingsSlice(...a)
}))

const Analysis = create<IAnalysisStore>((...a) => ({
  ...createAnalysisSlice(...a)
}))

export default {
  Global,
  Campaign,
  Training,
  Analysis
}
