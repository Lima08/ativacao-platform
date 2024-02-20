import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'

import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import LoadingScreen from 'components/LoadingScreen'
import PageRegisterTab from 'components/PageRegisterTab'

export default function RegisterCampaign() {
  const router = useRouter()
  let campaignId = ''
  if (router.isReady) {
    campaignId = String(router.query.id)
  }

  const [loading, uploadPercentage] = useGlobalStore((state) => [
    state.loading,
    state.uploadPercentage
  ])

  const [
    currentCampaign,
    getCampaignById,
    createCampaign,
    updateCampaign,
    resetCurrentCampaign
  ] = useMainStore((state) => [
    state.currentCampaign,
    state.getCampaignById,
    state.createCampaign,
    state.updateCampaign,
    state.resetCurrentCampaign
  ])

  const submitCampaign = async ({
    name,
    description,
    mediaIds,
    mediasToExclude
  }: {
    name: string
    description: string
    mediaIds: any[]
    mediasToExclude: any[]
  }) => {
    if (campaignId === 'new') {
      createCampaign({
        name,
        description,
        mediaIds
      })
    } else {
      updateCampaign(String(campaignId), {
        name,
        description,
        mediaIds,
        mediasToExclude
      })
    }
    resetCurrentCampaign()
    router.push('/in/campaigns')
  }

  const fetchCampaign = useCallback(() => {
    if (!campaignId || campaignId === 'new') {
      resetCurrentCampaign()
      return
    }

    getCampaignById(String(campaignId))
  }, [campaignId, getCampaignById, resetCurrentCampaign])

  useEffect(() => {
    fetchCampaign()
  }, [campaignId, fetchCampaign])

  return (
    <>
      <PageRegisterTab
        pageTitle="Campanhas"
        goBack={() => router.push('/in/campaigns')}
        resetState={resetCurrentCampaign}
        submit={submitCampaign}
        currentItem={currentCampaign}
      />

      {loading && !uploadPercentage && <LoadingScreen />}
    </>
  )
}
