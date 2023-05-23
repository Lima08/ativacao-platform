import { create } from 'zustand'

import createAnalysisSlice from './slices/analysisSlice'
import createCampaignsSlice from './slices/campaignSlice'
import createTrainingsSlice from './slices/trainingSlice'
import { IAnalysisStore } from './types/IAnalysisStore'
import { ICampaignStore } from './types/iCampaignStore'
import { ITrainingStore } from './types/iTrainingStore'

interface IMainStore extends IAnalysisStore, ICampaignStore, ITrainingStore {}
const useMainStore = create<IMainStore>((...a) => ({
  ...createCampaignsSlice(...a),
  ...createTrainingsSlice(...a),
  ...createAnalysisSlice(...a)
}))

export default useMainStore
