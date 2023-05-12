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

interface mediaObject {
  url: string
  type: string
}

export default function CampaignsPage({
  campaigns
}: {
  campaigns: ICampaignCreated[]
}) {
  const { deleteCampaign, updateCampaign } = useStore.getState()
  const router = useRouter()
  const [campaignsList, setCampaignsList] = useState<DataList[]>(
    campaignsAdapter(campaigns)
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
    const campaign = campaigns.find((campaign) => campaign.id === id)
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
      const nextCampaignList = campaignsList.filter(
        (campaign) => campaign.id !== id
      )
      setCampaignsList(nextCampaignList)
      deleteCampaign(id)
    }
  }

  // async function updateCampaignStatus(id: string) {}

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
