import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Box, Divider, List } from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'

import fourSquares from '../../../../images/icons/fourSquares'
// import homeIcon from '../../../images/icons/homeIcon'
import inboxIcon from '../../../../images/icons/inboxIcon'
import megaphoneIcon from '../../../../images/icons/megaphoneIcon'
import pizzaGraph from '../../../../images/icons/pizzaGraph'
import AsidePanelItem from './AsidePanelItem'

function AsidePanel() {
  const { user, company } = useAuthStore((state) => state) as IAuthStore

  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!user) return
    setIsAdmin(user.role >= ROLES.COMPANY_ADMIN)
  }, [user])
  return (
    <aside
      className="h-full flex flex-col border-gray-200 bg-white px-2 "
      aria-label="Sidebar"
    >
      <Link href="/in/campaigns">
        <Box
          component="img"
          src={company?.imageUrl ? company.imageUrl : '/logo-ativacao.png'}
          sx={{
            mt: 1,
            mx: 'auto',
            px: 1,
            py: 1,
            width: '100%',
            height: 'auto',
            maxWidth: '160px',
            alignSelf: 'center'
          }}
          alt="Ativacao Logo"
        />
      </Link>
      <div className="flex flex-col mt-4">
        <Divider />
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
