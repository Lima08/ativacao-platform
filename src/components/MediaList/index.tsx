import React, { useEffect, useState } from 'react'

import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { IconButton, Grid, Chip, Box } from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { IMediaCreated } from 'interfaces/entities/media'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'

import MediaShow from 'components/MediaShow'

type MediaProps = {
  mediasList: IMediaCreated[]
  onDelete: (id: string) => void
  height?: number | string
  width?: number | string
  showBadge?: boolean
}

export default function MediaList({
  mediasList,
  onDelete,
  height,
  width,
  showBadge = false
}: MediaProps) {
  const { user } = useAuthStore((state) => state) as IAuthStore
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!user || !user.role) return
    if (user.role >= ROLES.SYSTEM_ADMIN) {
      setIsAdmin(true)
    }
  }, [user])
  return (
    <Grid
      container
      spacing={3}
      sx={{
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center'
      }}
    >
      {mediasList.map(({ url, id, type, cover }) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={id} gap={4}>
          <div className="relative h-full max-w-[300px]">
            <Box
              sx={{
                zIndex: 1,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                position: 'absolute',
                gap: '4px'
              }}
            >
              {!!showBadge && !!cover && (
                <div className="absolute top-2 right-4">
                  <Chip label="Capa" color="success" />
                </div>
              )}
              {isAdmin && (
                <IconButton size="small" onClick={() => onDelete(id)}>
                  <HighlightOffIcon className="hover:bg-red-500 hover:text-white rounded-full " />
                </IconButton>
              )}
            </Box>

            <MediaShow url={url} type={type} height={height} width={width} />
          </div>
        </Grid>
      ))}
    </Grid>
  )
}
