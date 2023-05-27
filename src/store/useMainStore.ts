import { create } from 'zustand'

import createAnalysisSlice from './slices/analysisSlice'
import createCampaignsSlice from './slices/campaignSlice'
import createTrainingsSlice from './slices/trainingSlice'
import createUserSlice from './slices/userSlice'
import { IAnalysisStore } from './types/IAnalysisStore'
import { ICampaignStore } from './types/iCampaignStore'
import { ITrainingStore } from './types/iTrainingStore'
import { IUserStore } from './types/iUserStore'

interface IMainStore
  extends IAnalysisStore,
    ICampaignStore,
    ITrainingStore,
    IUserStore {}
const useMainStore = create<IMainStore>((...a) => ({
  ...createCampaignsSlice(...a),
  ...createTrainingsSlice(...a),
  ...createAnalysisSlice(...a),
  ...createUserSlice(...a)
}))

export default useMainStore
