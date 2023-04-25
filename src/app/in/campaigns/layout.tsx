import { ReactNode, Suspense } from 'react'
import { CampaignsContextProvider } from 'context/CampaignsContext'
import { getAllCampaigns } from 'useCases/campaigns'

export default async function CampaignLayout({
  children
}: {
  children: ReactNode
}) {
  // TODO: Virá do localStorage 
  const allCampaign = await getAllCampaigns({
    companyId: 'dfda4d4a-df82-47c3-bb5e-391cc4589ea1'
  })

  function adapterCampaignsToList(campaigns: any[]) {
    return campaigns.map((campaign) => {
      return {
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        userId: campaign.userId,
        companyId: campaign.companyId
      }
    })
  }

  return (
    <section>
      <CampaignsContextProvider
        listCampaigns={adapterCampaignsToList(allCampaign)}
      >
        <Suspense
          fallback={
            <div>
              <h1>Carregando...</h1>
            </div>
          }
        />
        {children}
      </CampaignsContextProvider>
    </section>
  )
}
