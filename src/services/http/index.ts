import Router from 'next/router'

import axios from 'axios'
import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'

import AnalysisService from './analysisServices '
import CampaignService from './campaignServices'
import TrainingService from './trainingServices'
import UploadService from './uploadServices'
import UserService from './UserServices'

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
    if (response.data.token) {
      window.localStorage.setItem('token', response.data.token)
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
      return error
    }

    return { error }
  }
)

const httpServices = {
  campaigns: CampaignService(httpClient),
  trainings: TrainingService(httpClient),
  analysis: AnalysisService(httpClient),
  upload: UploadService(httpClient),
  user: UserService(httpClient)
}

export default httpServices
