'use client'

import { useCampaignsContext } from '../../../context/CampaignsContext'
import TableWrapper from 'components/TableWrapper'
import PageContainer from 'components/PageContainer'

export default function CampaignsPage() {
  const { state } = useCampaignsContext()
  return (
    <PageContainer pageTitle="Campanhas" pageSection="campaigns">
      <TableWrapper data={state} />
    </PageContainer>
  )
}
