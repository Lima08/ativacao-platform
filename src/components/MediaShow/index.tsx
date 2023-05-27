import { Paper } from '@mui/material'

type MediaShowProp = {
  url: string
  id: string
  type: string
}

export default function MediaShow({ url, id, type }: MediaShowProp) {
  return (
    <Paper>
      {type === 'video' ? (
        <video className="w-full h-auto object-cover" src={url} controls />
      ) : (
        <img
          className="w-full h-auto object-cover"
          src={url}
          alt={`Arquivo ${id}`}
        />
      )}
    </Paper>
  )
}
