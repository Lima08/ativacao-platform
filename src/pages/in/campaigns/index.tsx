'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useStore from 'store/useStore'
import PageContainer from 'components/PageContainer'
import DashboardLayout from 'components/DashboardLayout'
import SearchPrevNext from 'components/SearchPrevNext'
import Modal from 'components/MediaViewer'
import ListItem from 'components/ListItem'
import type { DataList } from 'components/ListItem'
import type { ICampaignCreated } from 'interfaces/entities/campaign'

interface mediaObject {
  url: string
  type: string
}

export default function CampaignsList() {
  const router = useRouter()

  const [campaignsList, getAllCampaigns, deleteCampaign, error, loading] =
    useStore((state) => [
      state.campaignsList,
      state.getAllCampaigns,
      state.deleteCampaign,
      state.error,
      state.loading
    ])

  const [campaignsListAdapted, setCampaignsListAdapted] = useState<DataList[]>(
    []
  )
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
    const campaign = campaignsList.find((campaign) => campaign.id === id)
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

  function campaignsAdapter(campaignsList: ICampaignCreated[]) {
    const campaignsAdapted = campaignsList.map((campaign) => {
      return {
        id: campaign.id,
        name: campaign.name,
        description: campaign.description || null,
        active: campaign.active,
        img: {
          source:
            campaign?.medias[0]?.url ||
            'https://lojinha-da-aletha.dooca.store/admin/assets/logo-folded.1f809cab.svg',
          alt: 'Texto alternativo'
        }
      }
    })
    return campaignsAdapted
  }

  function deleteItem(id: string) {
    const userDecision = confirm('Confirmar deleção?')

    if (userDecision) {
      deleteCampaign(id)
    }
  }

  useEffect(() => {
    if (campaignsList.length > 0) return

    getAllCampaigns()
  }, [])

  useEffect(() => {
    if (!error) return
    alert('Erro ao carregar campanhas')
  }, [error])

  useEffect(() => {
    if (!campaignsList) return
    const campaignsAdapted = campaignsAdapter(campaignsList)
    setCampaignsListAdapted(campaignsAdapted)
  }, [campaignsList])

  return (
    <DashboardLayout>
      <PageContainer pageTitle="Campanhas" pageSection="campaigns">
        <SearchPrevNext />
        {loading && <p>Carregando...</p>}
        {!loading && !campaignsListAdapted.length && (
          <p>Nenhuma campanha encontrada</p>
        )}
        <ul className="list-none mt-8">
          {!loading &&
            !!campaignsListAdapted?.length &&
            campaignsListAdapted.map((campaign) => (
              <ListItem
                key={campaign.id}
                data={campaign}
                onDelete={() => deleteItem(campaign.id)}
                onEdit={handleEdit}
                onClickRow={onClickRow}
                // onClickToggle={updateCampaignStatus}
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
