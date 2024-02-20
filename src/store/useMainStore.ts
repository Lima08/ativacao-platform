import { create } from 'zustand'

import createAnalysisSlice, { IAnalysisStore } from './slices/analysisSlice'
import createCampaignsSlice, { ICampaignStore } from './slices/campaignSlice'
import createCatalogSlice, { ICatalogStore } from './slices/catalogSlice'
import createCompanySlice, { ICompanyStore } from './slices/companySlice'
import createDocumentSlice, { IDocumentStore } from './slices/documentSlice'
import createLogSlice, { ILogStore } from './slices/logSlice'
import createNotificationsSlice, {
  INotificationStore
} from './slices/notificationSlice'
import createProcessSlice, { IProcessStore } from './slices/processSlice'
import createTemplateProcessSlice, {
  ITemplateProcessStore
} from './slices/templateProcessSlice'
import createTrainingsSlice, { ITrainingStore } from './slices/trainingSlice'
import createUserSlice, { IUserStore } from './slices/userSlice'

interface IMainStore
  extends IAnalysisStore,
    IDocumentStore,
    ITemplateProcessStore,
    IProcessStore,
    ICampaignStore,
    ITrainingStore,
    IUserStore,
    ICompanyStore,
    INotificationStore,
    ILogStore,
    ICatalogStore {
  resetMainState: () => void
}
const useMainStore = create<IMainStore>((...a) => ({
  ...createCampaignsSlice(...a),
  ...createTrainingsSlice(...a),
  ...createAnalysisSlice(...a),
  ...createDocumentSlice(...a),
  ...createProcessSlice(...a),
  ...createTemplateProcessSlice(...a),
  ...createUserSlice(...a),
  ...createCompanySlice(...a),
  ...createNotificationsSlice(...a),
  ...createLogSlice(...a),
  ...createCatalogSlice(...a),
  resetMainState: () => {
    useMainStore.getState().resetCompanyState()
    useMainStore.getState().resetUserState()
    useMainStore.getState().resetAnalysisState()
    useMainStore.getState().resetTemplateProcessState()
    useMainStore.getState().resetProcessState()
    useMainStore.getState().resetTrainingState()
    useMainStore.getState().resetCampaignState()
    useMainStore.getState().resetNotificationState()
    useMainStore.getState().resetCatalogState()
  }
}))

export default useMainStore
