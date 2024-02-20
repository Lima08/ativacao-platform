import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import AutoAwesomeMosaicRounded from '@mui/icons-material/AutoAwesomeMosaicRounded'
import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import CampaignIcon from '@mui/icons-material/Campaign'
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import HomeIcon from '@mui/icons-material/Home'
import PeopleIcon from '@mui/icons-material/People'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Box, List } from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'

import AsidePanelItem from './AsidePanelItem'

function AsidePanel() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeMenu, setActiveMenu] = useState(router.pathname)

  const { user } = useAuthStore((state) => state) as IAuthStore

  const handleMenuClick = (linkSrc: string) => {
    setActiveMenu(linkSrc)
  }

  useEffect(() => {
    if (!user) return
    setIsAdmin(user.role >= ROLES.COMPANY_ADMIN)
  }, [user])

  return (
    <aside
      className="h-full flex flex-col rgb(229, 231, 235) md:px-4"
      aria-label="Sidebar"
    >
      <Link href="/in/home">
        <Box
          component="div"
          sx={{
            m: 1,
            mt: 2,
            width: '200',
            height: 'auto',
            maxHeight: '100px',
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center'
          }}
        >
          <Image
            src="/logo-ativacao.png"
            alt="Logo da empresa"
            priority
            width="180"
            height="90"
            style={{
              height: 'auto',
              width: '90%',
              objectFit: 'contain',
              objectPosition: 'center'
            }}
          />
        </Box>
      </Link>
      <Box
        sx={{
          mt: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start'
        }}
      >
        <List>
          <AsidePanelItem
            title="Início"
            linkSrc="/in/home"
            onClick={handleMenuClick}
            isActive={activeMenu === '/in/home'}
          >
            <HomeIcon />
          </AsidePanelItem>

          <AsidePanelItem
            title="Campanhas"
            linkSrc="/in/campaigns"
            onClick={handleMenuClick}
            isActive={activeMenu === '/in/campaigns'}
          >
            <CampaignIcon />
          </AsidePanelItem>

          <AsidePanelItem
            title="Catálogos"
            linkSrc="/in/catalogs"
            onClick={handleMenuClick}
            isActive={activeMenu === '/in/catalogs'}
            hide={!isAdmin}
          >
            <AutoAwesomeMosaicRounded />
          </AsidePanelItem>

          <AsidePanelItem
            title="Pedidos"
            linkSrc="/in/orders"
            onClick={handleMenuClick}
            isActive={activeMenu === '/in/orders'}
            hide={!isAdmin}
          >
            <ShoppingCartIcon />
          </AsidePanelItem>

          <AsidePanelItem
            title="Análises"
            linkSrc="/in/analyzes"
            onClick={handleMenuClick}
            isActive={activeMenu === '/in/analyzes'}
            hide={!isAdmin}
          >
            <AutoGraphIcon />
          </AsidePanelItem>

          <AsidePanelItem
            title="Processos"
            linkSrc="/in/processes"
            onClick={handleMenuClick}
            isActive={activeMenu === '/in/processes'}
            hide={!isAdmin}
          >
            <FilePresentIcon />
          </AsidePanelItem>

          <AsidePanelItem
            title="Treinamentos"
            linkSrc="/in/trainings"
            onClick={handleMenuClick}
            isActive={activeMenu === '/in/trainings'}
          >
            <AppRegistrationIcon />
          </AsidePanelItem>

          <AsidePanelItem
            title="Mural de avisos"
            linkSrc="/in/notifications"
            onClick={handleMenuClick}
            isActive={activeMenu === '/in/notifications'}
          >
            <CircleNotificationsIcon />
          </AsidePanelItem>

          <AsidePanelItem
            title="Usuários"
            linkSrc="/in/users"
            onClick={handleMenuClick}
            isActive={activeMenu === '/in/users'}
            hide={!isAdmin}
          >
            <PeopleIcon />
          </AsidePanelItem>
        </List>
      </Box>
    </aside>
  )
}

export default AsidePanel
