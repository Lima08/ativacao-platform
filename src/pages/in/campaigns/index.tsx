'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useStore from 'store/useStore'
import httpServices from 'services/http'
import PageContainer from 'components/PageContainer'
import DashboardLayout from 'components/DashboardLayout'
import TableWrapper from 'components/TableWrapper'
import SearchPrevNext from 'components/SearchPrevNext'
import Modal from 'components/MediaViewer'
import type { ICampaignCreated } from 'interfaces/entities/campaign'

export default function CampaignsPage({
  campaigns
}: {
  campaigns: ICampaignCreated[]
}) {
  const [idToDelete, setIdToDelete] = useState<string | null>(null)
  const router = useRouter()
  const [campaignsList] = useState(campaigns)
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

  return (
    <DashboardLayout>
      <PageContainer pageTitle="Campanhas" pageSection="campaigns">
        <SearchPrevNext />
        <TableWrapper
          data={campaignsList}
          onDelete={setIdToDelete}
          onEdit={handleEdit}
          onClickRow={onClickRow}
          section="Nenhuma campanha adicionada"
        />
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
