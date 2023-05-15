import axios from 'axios'
import Router from 'next/dist/client/router'
import CampaignService from './campaignServices'
import UploadService from './uploadServices'
import TrainingService from './trainingServices'

const httpClient = axios.create({
  baseURL: process.env.VERCEL_URL || process.env.DEVELOPMENT_URL
})

// httpClient.interceptors.request.use((config) => {
//   // setGlobalLoading(true)
//   const token = window.localStorage.getItem('token')
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// httpClient.interceptors.response.use(
//   (response) => {
//     // setGlobalLoading(false)
//     return response
//   },
//   (error) => {
//     // setGlobalLoading(false)
//     const canThrowAnError =
//       error.request?.status === 0 || error.request?.status === 500

//     if (canThrowAnError) {
//       // setGlobalLoading(false)
//       throw new Error(error.message)
//     }

//     if (error.response?.status === 401) {
//       // TODO: Ver se funfa
//       Router.push('/')
//     }

//     // setGlobalLoading(false)
//     return error
//   }
// )

const httpServices = {
  campaigns: CampaignService(httpClient),
  trainings: TrainingService(httpClient),
  upload: UploadService(httpClient)
}

export default httpServices
