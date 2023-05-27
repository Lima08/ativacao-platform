import React, { MouseEvent, useState } from 'react'

import { Notifications } from '@mui/icons-material'
import {
  Avatar,
  IconButton,
  Box,
  Badge,
  MenuItem,
  Popover,
  Typography,
  Divider
} from '@mui/material'

import CompanySettings from '../Configurations/CompanySettings'

function HeaderBar() {
  const [anchorEl, setAnchorEl] = useState<null | (EventTarget & Element)>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
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
      <IconButton color="inherit">
        <Badge badgeContent={4} color="error">
          <Notifications />
        </Badge>
      </IconButton>

      <Avatar
        src="/public/logo-ativacao.png"
        alt="photoURL"
        onClick={handleClick}
      />

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
        <MenuItem onClick={handleOpenConfiguration}>Configurações</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Popover>
      {isModalOpen && <CompanySettings handleCloseModal={handleCloseModal} />}
    </Box>
  )
}

export default HeaderBar
