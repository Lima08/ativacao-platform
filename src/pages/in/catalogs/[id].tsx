import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'

import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import LoadingScreen from 'components/LoadingScreen'
import PageRegisterTab from 'components/PageRegisterTab'

export default function RegisterCatalog() {
  const router = useRouter()
  let catalogId = ''
  if (router.isReady) {
    catalogId = String(router.query.id)
  }

  const [loading, uploadPercentage] = useGlobalStore((state) => [
    state.loading,
    state.uploadPercentage
  ])

  const [
    currentCatalog,
    getCatalogById,
    createCatalog,
    updateCatalog,
    resetCurrentCatalog
  ] = useMainStore((state) => [
    state.currentCatalog,
    state.getCatalogById,
    state.createCatalog,
    state.updateCatalog,
    state.resetCurrentCatalog
  ])

  const submitCatalog = async (payload: {
    name: string
    description: string
    mediaIds: any[]
    mediasToExclude: any[]
    documentIds: any[]
    documentsToExclude: any[]
  }) => {
    if (catalogId === 'new') {
      createCatalog(payload)
    } else {
      updateCatalog(String(catalogId), payload)
    }
    resetCurrentCatalog()
    router.push('/in/catalogs')
  }

  const fetchCatalog = useCallback(() => {
    if (!catalogId || catalogId === 'new') {
      resetCurrentCatalog()
      return
    }

    getCatalogById(String(catalogId))
  }, [catalogId, getCatalogById, resetCurrentCatalog])

  useEffect(() => {
    fetchCatalog()
  }, [catalogId, fetchCatalog])

  return (
    <>
      <PageRegisterTab
        pageTitle="Catálogos"
        goBack={() => router.push('/in/catalogs')}
        resetState={resetCurrentCatalog}
        submit={submitCatalog}
        currentItem={currentCatalog}
        showDocumentTab
      />

      {loading && !uploadPercentage && <LoadingScreen />}
    </>
  )
}
