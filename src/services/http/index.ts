import axios from 'axios'

import AnalysisService from './analysisServices'
import CampaignService from './campaignService'
import CompanyService from './companyService'
import TrainingService from './trainingService'
import UploadService from './uploadService'
import UserService from './UserService'

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
    // const errorStatus = error.response && error.response.status
    // if (
    //   [HTTP_STATUS.FORBIDDEN, HTTP_STATUS.UNAUTHORIZED].includes(errorStatus)
    // ) {
    //   VER se não faz mais sentido enviar uma mensagem e não deslogar
    //   window.localStorage.removeItem('token')
    //   Router.push('/login')
    // }

    return Promise.reject(error)
  }
)

const httpServices = {
  campaigns: CampaignService(httpClient),
  trainings: TrainingService(httpClient),
  analysis: AnalysisService(httpClient),
  upload: UploadService(httpClient),
  user: UserService(httpClient),
  company: CompanyService(httpClient)
}

export default httpServices
