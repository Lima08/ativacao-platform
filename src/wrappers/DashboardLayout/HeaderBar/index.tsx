import { useRouter } from 'next/router'
import React, { MouseEvent, useEffect, useState } from 'react'

// import { Notifications } from '@mui/icons-material'
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp'
import {
  Avatar,
  Box,
  MenuItem,
  Popover,
  Typography,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'

import AsidePanelMobile from '../AsidePanel/AsidePanelMobile'
import CompanySettings from './CompanySettings'

function HeaderBar() {
  const router = useRouter()

  const { user } = useAuthStore((state) => state) as IAuthStore
  const [userImage, setUserImage] = useState('')

  const [anchorEl, setAnchorEl] = useState<null | (EventTarget & Element)>(null)
  const open = Boolean(anchorEl)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOpenConfiguration = () => {
    setIsModalOpen(true)
    handleClose()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const logout = () => {
    window.localStorage.clear()
    router.push('/login')
  }

  useEffect(() => {
    if (!user || !user.imageUrl) return

    setUserImage(user.imageUrl)
  }, [user])

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        px: 2,
        py: 1,
        alignItems: 'center',
        gap: 2
      }}
    >
      {isMobile && <AsidePanelMobile />}

      {/* <IconButton color="inherit">
        <Badge badgeContent={4} color="error">
          <Notifications />
        </Badge>
      </IconButton> */}

      <div
        className="flex items-center justify-center gap-2 cursor-pointer md:absolute md:right-6 md:top-3  "
        onClick={handleClick}
      >
        <Avatar src={userImage} alt="Foto do usuário" />
        <MoreVertSharpIcon />
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
          {user && user.email && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {user.email}
            </Typography>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
        {user && user.role >= ROLES.COMPANY_ADMIN && (
          <MenuItem onClick={handleOpenConfiguration}>Configurações</MenuItem>
        )}
        <MenuItem onClick={logout}>Sair</MenuItem>
      </Popover>
      {isModalOpen && <CompanySettings handleCloseModal={handleCloseModal} />}
    </Box>
  )
}

export default HeaderBar
