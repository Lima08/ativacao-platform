import Router from 'next/router'

import axios from 'axios'
import useStore from 'store/useStore'

import AnalysisService from './analysisServices '
import CampaignService from './campaignServices'
import TrainingService from './trainingServices'
import UploadService from './uploadServices'
import UserService from './UserServices'

const httpClient = axios.create()

httpClient.interceptors.request.use((config) => {
  useStore.Global().setLoading(true)

  const token = window.localStorage.getItem('token')
  console.log(
    '🚀 ~ file: index.ts:14 ~ httpClient.interceptors.request.use ~ token:',
    token
  )
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => {
      useStore.Global().setLoading(true)

    return response
  },
  (error) => {
    if (error.response && error.response.status === 403) {
      Router.push('/login')
    }

      useStore.Global().setLoading(true)
      useStore.Global().setError(error)

    return error
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
