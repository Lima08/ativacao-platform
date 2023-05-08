'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useStore from 'store/useStore'
import httpServices from 'services/http'
import PageContainer from 'components/PageContainer'
import DashboardLayout from 'components/DashboardLayout'
import SearchPrevNext from 'components/SearchPrevNext'
import Modal from 'components/MediaViewer'
import ListItem from 'components/ListItem'
import type { DataList } from 'components/ListItem'
import type { ICampaignCreated } from 'interfaces/entities/campaign'

export default function CampaignsPage({
  campaigns
}: {
  campaigns: ICampaignCreated[]
}) {
  const [idToDelete, setIdToDelete] = useState<string | null>(null)
  const router = useRouter()
  const [campaignsList, setCampaignsList] = useState<DataList[]>([])
  const [open, setOpen] = useState(false)
  const [campaign, setCampaign] = useState<{
    title: string
    description: string
    media: string[]
  }>({ title: '', description: '', media: [] })

  const { deleteCampaign } = useStore.getState()

  useEffect(() => {
    if (idToDelete) {
      deleteCampaign(idToDelete)
    }
  }, [idToDelete])

  const handleEdit = async (id: string) => {
    router.push(`/in/campaigns/${id}`)
  }

  const onClickRow = async (id: string) => {
    const campaign = campaigns.find((campaign) => campaign.id === id)
    const media = campaign?.medias
    if (!!media?.length) return alert('Nenhuma media encontrada')
    setCampaign({
      title: campaign?.name || '',
      description: campaign?.description || '',
      media: mediasAdapter(campaign?.medias || [])
    })

    setOpen(true)
  }

  function mediasAdapter(mediasList: any[]) {
    const mediaURLs = mediasList.map((media) => media.url)
    return mediaURLs
  }

  // TODO: Corrigir a forma que define a imagem de capa

  function campaignsAdapter(campaignsList: ICampaignCreated[]) {
    console.log(
      '🚀 ~ file: index.tsx:62 ~ campaignsAdapter ~ campaignsList:',
      campaignsList
    )
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

  useEffect(() => {
    if (idToDelete) {
      deleteCampaign(idToDelete)
    }
  }, [idToDelete])

  useEffect(() => {
    const campaignsAdapted = campaignsAdapter(campaigns)
    setCampaignsList(campaignsAdapted)
  }, [campaigns])

  return (
    <DashboardLayout>
      <PageContainer pageTitle="Campanhas" pageSection="campaigns">
        <SearchPrevNext />
        {!campaignsList.length && <p>Nenhuma campanha encontrada</p>}
        <ul className="list-none mt-8">
          {!!campaignsList.length &&
            campaignsList.map((campaign) => (
              <ListItem
                key={campaign.id}
                data={campaign}
                onDelete={setIdToDelete}
                onEdit={handleEdit}
                onClickRow={onClickRow}
                onClickToggle={() => console.log('clicou no toggle')}
              />
            ))}
        </ul>

        {open && (
          <Modal
            title={campaign.title}
            description={campaign.description}
            imageSource={campaign.media[0]}
            medias={campaign.media}
            open={open}
            setOpen={setOpen}
          />
        )}
      </PageContainer>
    </DashboardLayout>
  )
}

export async function getServerSideProps() {
  const response = await httpServices.campaigns.getAll()
  if (response.data) {
    return {
      props: {
        campaigns: response.data
      }
    }
  } else {
    return {
      props: {
        campaigns: []
      }
    }
  }
}
