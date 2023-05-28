import { useEffect, useState } from 'react'

import { Box, List } from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'

import fourSquares from '../../../../images/icons/fourSquares'
import inboxIcon from '../../../../images/icons/inboxIcon'
import megaphoneIcon from '../../../../images/icons/megaphoneIcon'
import pizzaGraph from '../../../../images/icons/pizzaGraph'
import AsidePanelItem from './AsidePanelItem'

function AsidePanel() {
  const { user, company } = useAuthStore((state) => state) as IAuthStore

  const [isAdmin, setIsAdmin] = useState(false)
  const [logoSrl, setLogoSrl] = useState('/logo-ativacao.png')

  useEffect(() => {
    if (!user) return
    setIsAdmin(user.role >= ROLES.COMPANY_ADMIN)
  }, [user])

  useEffect(() => {
    if (!company || !company.imageUrl) return
    setLogoSrl(company?.imageUrl)
  }, [company])

  return (
    <aside
      className="h-full flex flex-col border-gray-200 bg-white px-2 "
      aria-label="Sidebar"
    >
      <Box
        component="div"
        sx={{
          mt: 1,
          ml: 0,
          px: 1,
          py: 1,
          width: '100%',
          height: 'auto',
          maxHeight: '80px',
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center'
        }}
      >
        <img
          src={logoSrl}
          alt="Lodo da empresa"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            objectPosition: 'center'
          }}
        />
      </Box>
      <div className="flex flex-col mt-4">
        <List>
          {/* <AsidePanelItem title="Home" linkSrc="/in" icon={homeIcon} /> */}
          <AsidePanelItem
            title="Campanhas"
            linkSrc="/in/campaigns"
            icon={megaphoneIcon}
          />
          <AsidePanelItem
            title="Treinamentos"
            linkSrc="/in/trainings"
            icon={fourSquares}
          />
          {isAdmin && (
            <AsidePanelItem
              title="Análises"
              linkSrc="/in/analyzes"
              icon={pizzaGraph}
            />
          )}

          <AsidePanelItem
            title="Usuários"
            linkSrc="/in/users"
            icon={inboxIcon}
          />
        </List>
      </div>
    </aside>
  )
}

export default AsidePanel
