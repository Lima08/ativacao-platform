'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import type { ICampaignCreated } from 'interfaces/entities/campaign'
import useStore from 'store/useStore'

import DashboardLayout from 'components/DashboardLayout'
import ListItem from 'components/ListItem'
import type { DataList } from 'components/ListItem'
import Modal from 'components/MediaViewer'
import PageContainer from 'components/PageContainer'
import SearchPrevNext from 'components/SearchPrevNext'

interface mediaObject {
  url: string
  type: string
}

export default function AnalysisList() {
  const router = useRouter()

  // const [
  //   analysisList,
  //   getAllCampaigns,
  //   handleCampaignActive,
  //   deleteCampaign,
  //   error,
  //   loading
  // ] = useStore.Campaign((state) => [
  //   state.analysisList,
  //   state.getAllCampaigns,
  //   state.handleCampaignActive,
  //   state.deleteCampaign,
  //   state.error,
  //   state.loading
  // ])

  // const [analysisListAdapted, analysisListAdapted] = useState<DataList[]>(
  //   []
  // )
  const [open, setOpen] = useState(false)
  const [campaign, setCampaign] = useState<{
    title: string
    description: string
    media: mediaObject[]
  }>({ title: '', description: '', media: [] })

  const handleEdit = async (id: string) => {
    router.push(`/in/campaigns/${id}`)
  }

  const onClickRow = async (id: string) => {
    const campaign = analysisList.find((campaign) => campaign.id === id)
    const media = campaign?.medias

    if (!media?.length) return alert('Nenhuma media encontrada')
    setCampaign({
      title: campaign?.name || '',
      description: campaign?.description || '',
      media: mediasAdapter(campaign?.medias || [])
    })

    setOpen(true)
  }

  function mediasAdapter(mediasList: any[]) {
    const mediaURLs = mediasList.map(({ url, type }) => ({
      url,
      type
    }))
    return mediaURLs
  }

  // TODO: Corrigir a forma que define a imagem de capa

  function campaignsAdapter(analysisList: ICampaignCreated[]) {
    const campaignsAdapted = analysisList.map((campaign) => {
      return {
        id: campaign.id,
        name: campaign.name,
        description: campaign.description || null,
        active: campaign.active,
        img: {
          source: campaign?.medias[0]?.url || '/logo-ativacao.png',
          alt: 'Texto alternativo'
        }
      }
    })
    console.log(
      '🚀 ~ file: index.tsx:89 ~ campaignsAdapted ~ campaignsAdapted:',
      campaignsAdapted
    )
    return campaignsAdapted
  }

  function deleteItem(id: string) {
    const userDecision = confirm('Confirmar deleção?')

    if (userDecision) {
      deleteCampaign(id)
    }
  }

  function handleCampaignStatus(id: string, active: boolean) {
    handleCampaignActive(id, active)
  }

  useEffect(() => {
    console.log('useEffect')
    getAllCampaigns()
  }, [])

  useEffect(() => {
    if (!error) return
    alert('Erro ao carregar campanhas')
  }, [error])

  useEffect(() => {
    if (!analysisList) return
    const campaignsAdapted = campaignsAdapter(analysisList)
    analysisListAdapted(campaignsAdapted)
  }, [analysisList])

  return (
    <DashboardLayout>
      <PageContainer pageTitle="Campanhas" pageSection="campaigns">
        <SearchPrevNext />
        {loading && <p>Carregando...</p>}
        {!loading && !analysisListAdapted.length && (
          <li className="flex items-center justify-center mt-5 bg-white h-12 w-full border rounded">
            Nenhuma campanha encontrada
          </li>
        )}
        <ul className="list-none mt-8">
          {!!analysisListAdapted?.length &&
            analysisListAdapted.map((campaign) => (
              <ListItem
                key={campaign.id}
                data={campaign}
                onDelete={() => deleteItem(campaign.id)}
                onEdit={handleEdit}
                onClickRow={onClickRow}
                onClickToggle={handleCampaignStatus}
              />
            ))}
        </ul>
        {open && (
          <Modal
            title={campaign.title}
            description={campaign.description}
            imageSource={
              campaign.media[0].type === 'image'
                ? campaign.media[0]
                : 'default img src'
            }
            medias={campaign.media}
            open={open}
            setOpen={setOpen}
          />
        )}
      </PageContainer>
    </DashboardLayout>
  )
}
