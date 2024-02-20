import Router from 'next/router'

import axios from 'axios'
import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'

import { ApiResponse } from '../../../types'
import AnalysisService from './analysisServices'
import CampaignService from './campaignService'
import CatalogService from './catalogService'
import CompanyService from './companyService'
import DocumentService from './documentServices'
import LogService from './logService'
import NotificationService from './notificationService'
import OrderService from './orderServices'
import ProcessService from './processServices'
import TemplateOrderService from './templateOrderServices'
import TemplateProcessService from './templateProcessServices'
import TrainingService from './trainingService'
import UploadService from './uploadService'
import UserService from './userService'

export interface HttpServices {
  campaigns: ReturnType<typeof CampaignService>
  trainings: ReturnType<typeof TrainingService>
  analysis: ReturnType<typeof AnalysisService>
  process: ReturnType<typeof ProcessService>
  document: ReturnType<typeof DocumentService>
  templateProcess: ReturnType<typeof TemplateProcessService>
  upload: ReturnType<typeof UploadService>
  user: ReturnType<typeof UserService>
  company: ReturnType<typeof CompanyService>
  notifications: ReturnType<typeof NotificationService>
  logs: ReturnType<typeof LogService>
  catalog: ReturnType<typeof CatalogService>
  order: ReturnType<typeof OrderService>
  templateOrder: ReturnType<typeof TemplateOrderService>
}

const httpClient = axios.create()

httpClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data && data.data && data.data.token) {
      window.localStorage.setItem('token', data.data.token)
    }
    return response
  },
  (error) => {
    const errorStatus = error.response && error.response.status
    if (
      [HTTP_STATUS.FORBIDDEN, HTTP_STATUS.UNAUTHORIZED].includes(errorStatus)
    ) {
      window.localStorage.removeItem('token')
      Router.push('/login')
    }

    return Promise.reject(error.response.data)
  }
)

const httpServices: HttpServices = {
  campaigns: CampaignService(httpClient),
  trainings: TrainingService(httpClient),
  analysis: AnalysisService(httpClient),
  process: ProcessService(httpClient),
  document: DocumentService(httpClient),
  templateProcess: TemplateProcessService(httpClient),
  upload: UploadService(httpClient),
  user: UserService(httpClient),
  company: CompanyService(httpClient),
  notifications: NotificationService(httpClient),
  logs: LogService(httpClient),
  catalog: CatalogService(httpClient),
  order: OrderService(httpClient),
  templateOrder: TemplateOrderService(httpClient)
}

export default httpServices
