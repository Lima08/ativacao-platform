'use client'
import ListWrapper2 from 'components/ListWrapper2'
import PageContainer from 'components/PageContainer'
import React, { useState } from 'react'
import { CampaignsContext } from '../../../../context'

export default function Campaigns() {
  const [campaingsList, setCampaingsList] = useState([])

  return (
    <CampaignsContext.Provider
      value={{ state: campaingsList, setState: setCampaingsList }}
    >
      <title>Ativação TEC | Campanhas</title>
      <PageContainer pageTitle="Campanhas" buttonTitle="campanha">
        <ListWrapper2 pageTitle="campanha" />
      </PageContainer>
    </CampaignsContext.Provider>
  )
}
