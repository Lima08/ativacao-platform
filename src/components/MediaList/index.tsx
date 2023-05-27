import React from 'react'

import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { IconButton, Grid } from '@mui/material'

import MediaShow from 'components/MediaShow'

import { MediaResponseType } from '../../../types'

type MediaProps = {
  mediasList: MediaResponseType[]
  onDelete: (id: string) => void
}

export default function MediaList({ mediasList, onDelete }: MediaProps) {
  return (
    <div className="p-4">
      <Grid container spacing={3}>
        {mediasList.map(({ url, id, key, type }) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
            <div className="relative">
              <IconButton
                style={{ zIndex: 1 }}
                className="absolute right-0 top-0 m-1 hover:bg-red-500 hover:text-white"
                onClick={() => onDelete(id)}
              >
                <HighlightOffIcon />
              </IconButton>
              <MediaShow url={url} id={id} type={type} />
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}
