import { Paper } from '@mui/material'

type MediaShowProp = {
  url: string
  type: string
}

export default function MediaShow({ url,  type }: MediaShowProp) {
  return (
    <Paper>
      {type === 'video' ? (
        <video className="w-full h-auto object-cover" src={url} controls />
      ) : (
        <img
          className="w-full h-auto object-cover"
          src={url}
          alt={`Arquivo de ${type}`}
        />
      )}
    </Paper>
  )
}
