import { create } from 'zustand'

import createAnalysisSlice, { IAnalysisStore } from './slices/analysisSlice'
import createCampaignsSlice, { ICampaignStore } from './slices/campaignSlice'
import createCompanySlice, { ICompanyStore } from './slices/companySlice'
import createTrainingsSlice, { ITrainingStore } from './slices/trainingSlice'
import createUserSlice, { IUserStore } from './slices/userSlice'

interface IMainStore
  extends IAnalysisStore,
    ICampaignStore,
    ITrainingStore,
    IUserStore,
    ICompanyStore {}
const useMainStore = create<IMainStore>((...a) => ({
  ...createCampaignsSlice(...a),
  ...createTrainingsSlice(...a),
  ...createAnalysisSlice(...a),
  ...createUserSlice(...a),
  ...createCompanySlice(...a)
}))

export default useMainStore
