'use client'

import { useRouter } from 'next/router'
import TableWrapper from 'components/TableWrapper'
import PageContainer from 'components/PageContainer'
import DashboardLayout from 'components/DashboardLayout'
import useStore from 'store/useStore'
import httpServices from 'services/http'
import { useState } from 'react'
import Modal from 'components/MediaViewer'
import SearchPrevNext from 'components/SearchPrevNext'

export default function CampaignsPage({ campaigns }: { campaigns: any[] }) {
  const [open, setOpen] = useState(false)
  const [campaign, setCampaign] = useState<{
    title: string
    description: string
    media: string[]
  }>({ title: '', description: '', media: [] })

  const router = useRouter()

  const handleDelete = async (id: string) => {
    useStore.getState().deleteCampaign(id)
  }

  const handleEdit = async (id: string) => {
    router.push(`/in/campaigns/${id}`)
  }

  const onClickRow = async (id: string) => {
    const campaign = campaigns.find((campaign) => campaign.id === id)
    const media = campaign.medias
    if (media.length === 0) return alert('Nenhuma media encontrada')
    setCampaign({
      title: campaign.name,
      description: campaign.description,
      media: mediasAdapter(campaign.medias)
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
          data={campaigns}
          onDelete={handleDelete}
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
  useStore.getState().getAllCampaigns()
  const response = await httpServices.campaigns.getAll()

  return {
    props: {
      campaigns: response.data || []
    }
  }
}
