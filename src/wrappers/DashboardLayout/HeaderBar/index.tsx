import { useRouter } from 'next/router'
import React, { MouseEvent, useEffect, useState } from 'react'

// import { Notifications } from '@mui/icons-material'
import {
  Avatar,
  // IconButton,
  Box,
  // Badge,
  MenuItem,
  Popover,
  Typography,
  Divider
} from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'

import CompanySettings from './CompanySettings'

function HeaderBar() {
  const router = useRouter()
  const loggedUser = useAuthStore((state: any) => state.user)

  const { user } = useAuthStore((state) => state) as IAuthStore
  const [anchorEl, setAnchorEl] = useState<null | (EventTarget & Element)>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userImage, setUserImage] = useState('')
  const open = Boolean(anchorEl)
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
    if (!loggedUser || !loggedUser.imageUrl) return

    setUserImage(loggedUser.imageUrl)
  }, [loggedUser])

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        px: 2,
        py: 1,
        alignItems: 'center',
        gap: 2
      }}
    >
      {/* <IconButton color="inherit">
        <Badge badgeContent={4} color="error">
          <Notifications />
        </Badge>
      </IconButton> */}

      <Avatar src={userImage} alt="photoURL" onClick={handleClick} />

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
            Lima
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            joaopaulo.gomeslima8@gmail.com
          </Typography>
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
