'use client'

// import { useRouter } from 'next/navigation'
import httpServices from 'services/http'
import { useCampaignsContext } from '../../../context/CampaignsContext'
import TableWrapper from 'components/TableWrapper'
import PageContainer from 'components/PageContainer'

export default function CampaignsPage() {
  // const router = useRouter()
  const { state } = useCampaignsContext()

  const handleDelete = async (id: string) => {
    try {
      await httpServices.campaigns.delete(id)

      // TODO: Colocar toast de sucesso
    } catch (error) {
      // TODO: Colocar toast de falha
      console.error(error)
    }
  }
  const handleEdit = async (id: string) => {
    // TEMP: Ex de como fazer edit
    try {
      await httpServices.campaigns.update(id, {
        name: 'Campanha editada pelo front',
        description:
          'Edição hardcode para exemplo de como fazer no componente register',
        mediaIds: [] // Conforme o componente upload adiciona
      })

      // TODO: Colocar toast de sucesso
    } catch (error) {
      // TODO: Colocar toast de falha
      console.error(error)
    }
    // TODO: Adiciona navegação para CampaignRegister e la utiliza o método update
    // router.push(`/in/campaigns/${id}`)
  }

  return (
    <PageContainer pageTitle="Campanhas" pageSection="campaigns">
      {/* const { state, setData } = useCampaignsContext()
      <TableWrapper data={state} setData={setData} /> */}
      <TableWrapper data={state} onDelete={handleDelete} onEdit={handleEdit} />
    </PageContainer>
  )
}
