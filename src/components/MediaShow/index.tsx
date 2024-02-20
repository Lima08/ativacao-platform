import Image from 'next/image'
import Link from 'next/link'

import { Card, Tooltip } from '@mui/material'

type MediaShowProp = {
  url: string
  type: string
  height?: string | number
  width?: string | number
}

export default function MediaShow({ url, type, height, width }: MediaShowProp) {
  return (
    <Card
      sx={{
        borderRadius: '4px',
        transition: 'all 0.3s',
        height: height || '260px',
        width: width || '260px',
        '&:hover': {
          transform: 'scale(1.1)',
          boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.35)',
          '& .MuiTypography-root::before': {
            transform: 'scaleX(1)',
            transition: 'transform 0.2s ease-in-out'
          }
        }
      }}
    >
      {type === 'video' && <video autoPlay={false} src={url} controls />}

      {type === 'image' && (
        <Tooltip title="Clique para ampliar">
          <Link href={url} target="_blank">
            <Image
              width={260}
              height={260}
              priority
              style={{
                width: '100%',
                height: '100%',
                maxHeight: 'auto',
                maxWidth: 'auto',
                objectFit: 'cover'
              }}
              src={url}
              alt={`Arquivo de ${type}`}
            />
          </Link>
        </Tooltip>
      )}
    </Card>
  )
}
