import { useRouter } from 'next/router'
import React, { MouseEvent, useEffect, useState } from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import {
  Avatar,
  Box,
  MenuItem,
  Popover,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
  IconButton,
  Badge
} from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { INotificationCreated } from 'interfaces/entities/notification'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'
import useMainStore from 'store/useMainStore'
import { useNotificationStore } from 'store/useNotificationStore'

import AsidePanelMobile from '../AsidePanel/AsidePanelMobile'
import BannerSettings from './BannerSettings'
import BreadcrumbCustom from './BreadcrumbCustom'
import CompanySettings from './CompanySettings'
import CreateCompanyModal from './CreateCompanyModal'
import NotificationSidebar from './NotificationSidebar'
import UserSettings from './UserSettings'
function HeaderBar() {
  const router = useRouter()

  const { user, company } = useAuthStore.getState() as IAuthStore
  const [userImage, setUserImage] = useState('')

  const [anchorEl, setAnchorEl] = useState<null | (EventTarget & Element)>(null)
  const open = Boolean(anchorEl)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false)
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notViewedCounter, setNotViewedCounter] = useState(0)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [resetMainState, notificationsList, getAllNotifications, createLog] =
    useMainStore((state) => [
      state.resetMainState,
      state.notificationsList,
      state.getAllNotifications,
      state.createLog
    ])

  const [notificationsViewed] = useNotificationStore((state: any) => [
    state.notificationsViewed
  ])

  const handleMenuPopoverConfiguration = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOpenConfiguration = (type: string) => {
    if (type === 'user') setIsModalOpen(true)
    if (type === 'company') setIsCompanyModalOpen(true)
    if (type === 'banner') setIsBannerModalOpen(true)
    if (type === 'newCompany') setIsNewCompanyModalOpen(true)
    handleClose()
  }

  const logout = () => {
    resetMainState()
    createLog({
      module: 'Logout',
      info: 'Logout'
    })
    router.push('/login')
  }

  useEffect(() => {
    if (!user || !user.imageUrl) return
    setUserImage(user.imageUrl)
  }, [user])

  useEffect(() => {
    if (notificationsList) return
    getAllNotifications()
  }, [notificationsList, getAllNotifications])

  useEffect(() => {
    if (!notificationsList) return

    let notViewed = notificationsList.length

    if (notificationsViewed) {
      notificationsList.forEach((notification: INotificationCreated) => {
        if (notificationsViewed.includes(notification.id)) {
          notViewed--
        }
      })
    }

    setNotViewedCounter(notViewed)
  }, [notificationsList, notificationsViewed])

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '4rem',
        px: 2,
        py: 1,
        gap: 2
      }}
    >
      {isMobile && <AsidePanelMobile />}

      {!isMobile && <BreadcrumbCustom />}
      <div className="flex items-center justify-center gap-6 cursor-pointer md:absolute md:right-6 md:top-3 mx-4">
        <IconButton onClick={() => setIsNotificationsOpen(true)}>
          <Badge badgeContent={notViewedCounter} color="error">
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        <div
          onClick={handleMenuPopoverConfiguration}
          className="flex items-center justify-center "
        >
          <Avatar src={userImage} alt="Foto do usuário" />
          <MoreVertIcon />
        </div>
      </div>

      <Popover
        open={Boolean(open)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75
            }
          }
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {user?.name || 'Usuário'}
          </Typography>
          {company && company.name && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {company.name}
            </Typography>
          )}
          {user && user.email && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {user.email}
            </Typography>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem onClick={() => handleOpenConfiguration('user')}>
          Perfil
        </MenuItem>
        {user && user.role >= ROLES.SYSTEM_ADMIN && (
          <MenuItem onClick={() => handleOpenConfiguration('banner')}>
            Banner
          </MenuItem>
        )}
        {user && user.role >= ROLES.SUPER_ADMIN && (
          <MenuItem onClick={() => handleOpenConfiguration('newCompany')}>
            Criar empresa
          </MenuItem>
        )}
        {user && user.role >= ROLES.COMPANY_ADMIN && (
          <MenuItem onClick={() => handleOpenConfiguration('company')}>
            Configurações
          </MenuItem>
        )}
        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={logout}>Sair</MenuItem>
      </Popover>

      {isModalOpen && (
        <UserSettings handleCloseModal={() => setIsModalOpen(false)} />
      )}
      {isCompanyModalOpen && (
        <CompanySettings
          handleCloseModal={() => setIsCompanyModalOpen(false)}
        />
      )}
      {isBannerModalOpen && (
        <BannerSettings handleCloseModal={() => setIsBannerModalOpen(false)} />
      )}
      {isNotificationsOpen && (
        <NotificationSidebar
          handleDrawer={setIsNotificationsOpen}
          isOpen={isNotificationsOpen}
        />
      )}
      {isNewCompanyModalOpen && (
        <CreateCompanyModal
          handleCloseModal={() => setIsNewCompanyModalOpen(false)}
        />
      )}
    </Box>
  )
}

export default HeaderBar
