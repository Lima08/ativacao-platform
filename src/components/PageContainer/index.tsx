'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

import { Box, Button, Typography } from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'

type PageContainerProps = {
  children: ReactNode
  pageTitle: string
  pageSection?: string
  customCallback?: () => void
  secondaryAction?: {
    label: string
    callback: () => void
  }
  isProcesses?: boolean
}

export default function PageContainer({
  pageTitle,
  pageSection,
  children,
  customCallback,
  secondaryAction,
  isProcesses
}: PageContainerProps) {
  const { user } = useAuthStore((state) => state) as IAuthStore

  const [isAdmin, setIsAdmin] = useState(false)

  const router = useRouter()

  function navToCreatePage() {
    if (customCallback) {
      customCallback()
    } else {
      router.push(`/in/${pageSection}/new`)
    }
  }

  useEffect(() => {
    if (!user) return
    setIsAdmin(user.role >= ROLES.COMPANY_ADMIN)
  }, [user])
  return (
    <Box
      className="page-container"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        p: 2,
        pb: 0
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {pageTitle}
        </Typography>

        {isAdmin && !isProcesses && pageSection && (
          <Button variant="contained" onClick={navToCreatePage}>
            Adicionar
          </Button>
        )}

        {secondaryAction && (
          <Button variant="contained" onClick={secondaryAction.callback}>
            {secondaryAction.label}
          </Button>
        )}
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          mt: 2,
          overflowY: 'auto',
          maxHeight: 600
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
