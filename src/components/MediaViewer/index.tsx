import Image from 'next/image'
import { useCallback, useState } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Pagination,
  Tooltip
} from '@mui/material'
import useMainStore from 'store/useMainStore'

interface MediaObject {
  url: string
  type: string
}

interface ModelValue {
  id: string
  title: string
  medias: MediaObject[]
}

interface ModalProps {
  module?: string
  modelValue: ModelValue
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

export default function MediaViewer({
  modelValue,
  module,
  open,
  setOpen
}: ModalProps) {
  const [index, setIndex] = useState(0)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const mediasWatchedSet = useState(new Set<number>().add(1))[0]

  const [createLog] = useMainStore((state) => [state.createLog])

  const onChangeMedia = (_: any, page: number) => {
    updateMediaWatched(page)
    setIndex(page - 1)
  }

  const handleClose = () => {
    handleCreateLog()
    setOpen(false)
  }

  function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <DialogTitle {...other}>
          {children}

          {onClose ? (
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[600],
                backgroundColor: 'transparent'
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>
      </Box>
    )
  }

  const updateMediaWatched = useCallback(
    (value: number) => {
      mediasWatchedSet.add(value)
    },
    [mediasWatchedSet]
  )

  const handleCreateLog = useCallback(() => {
    let campaignId = ''
    let trainingId = ''

    if (module === 'campaign') {
      campaignId = modelValue.id
    }

    if (module === 'training') {
      trainingId = modelValue.id
    }

    createLog({
      module,
      info: modelValue.title,
      campaignId,
      trainingId,
      totalMedias: modelValue.medias.length,
      mediasWatched: mediasWatchedSet.size
    })
  }, [
    createLog,
    modelValue.id,
    modelValue.title,
    module,
    modelValue.medias.length,
    mediasWatchedSet.size
  ])

  return (
    <Dialog open={open} aria-labelledby="media-dialog-title" fullScreen>
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        {modelValue.title}
      </BootstrapDialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 0
        }}
      >
        {modelValue.medias.map((media, mediaIndex) => (
          <div
            key={mediaIndex}
            hidden={index !== mediaIndex}
            className="h-full w-full"
          >
            {media.type === 'image' && (
              <Tooltip title="Ampliar">
                <a
                  href={modelValue.medias[index].url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={media.url}
                    alt={`Imagem ${mediaIndex + 1} - ${modelValue.title}`}
                    height={400}
                    width={800}
                    priority
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'scale-down',
                      borderRadius: '8px'
                    }}
                  />
                </a>
              </Tooltip>
            )}
            {media.type === 'video' && (
              <video
                autoPlay={false}
                controls
                controlsList="download"
                style={{
                  height: '100%',
                  width: '100%'
                }}
                src={media.url}
                preload={videoLoaded ? 'auto' : 'metadata'}
                onLoadedData={() => setVideoLoaded(true)}
              />
            )}
          </div>
        ))}
      </DialogContent>
      <Pagination
        count={modelValue.medias.length}
        page={index + 1}
        onChange={onChangeMedia}
        shape="rounded"
        siblingCount={0}
        sx={{
          backgroundColor: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          py: '10px'
        }}
      />
    </Dialog>
  )
}
