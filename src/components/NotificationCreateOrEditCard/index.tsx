import Image from 'next/image'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {
  Card,
  CardContent,
  Modal,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  CardActions,
  useTheme,
  useMediaQuery
} from '@mui/material'
import useIsAdmin from 'hooks/useIsAdmin'
import { useUpload } from 'hooks/useUpload'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'
import * as Yup from 'yup'

import LoadingScreen from 'components/LoadingScreen'
import Uploader from 'components/Uploader'

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Campo não pode ser vazio')
    .min(3, 'Título muito curto')
    .max(95, 'Título muito longo'),
  description: Yup.string()
    .required('Campo não pode ser vazio')
    .max(500, 'Descrição muito longa'),
  link: Yup.string().url('Url invalida').nullable()
})

interface IFormValues {
  imageUrl?: string
  title: string
  description: string
  link?: string
}

type NotificationCreateModalProps = {
  handleModalVisibility: Dispatch<SetStateAction<boolean>>
  isModalOpen: boolean
  descriptionLabel?: string
  onlyView?: boolean
}

function NotificationCreateOrEditCard({
  handleModalVisibility,
  isModalOpen,
  descriptionLabel = '"Escreva aqui a sua mensagem...."',
  onlyView = false
}: NotificationCreateModalProps) {
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined)
  const [loadingCreateNotification, setLoadingCreateNotification] =
    useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IFormValues>({
    resolver: yupResolver(validationSchema)
  })

  const [
    currentNotification,
    createNotification,
    updateNotification,
    resetCurrentNotification
  ] = useMainStore((state) => [
    state.currentNotification,
    state.createNotification,
    state.updateNotification,
    state.resetCurrentNotification
  ])

  const { uploadFiles } = useUpload()
  const isAdmin = useIsAdmin()
  const [loading, setToaster] = useGlobalStore((state) => [
    state.loading,
    state.setToaster
  ])

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleFileUpload = async (e: any) => {
    e.preventDefault()
    const files = e.target.files

    try {
      const mediaFiles = await uploadFiles(files)
      if (!mediaFiles) return
      setCoverImage(mediaFiles[0].url)
    } catch (error) {
      console.error(error)
      return
    }
  }

  const handleClose = () => {
    resetCurrentNotification()
    reset({ title: '', description: '', link: '' })
    setCoverImage(undefined)
    handleModalVisibility(false)
  }

  const createOrUpdateNotification = (data: IFormValues) => {
    const { title, description, link } = data

    try {
      setLoadingCreateNotification(true)
      if (currentNotification) {
        updateNotification(currentNotification.id, {
          imageUrl: coverImage,
          title,
          description,
          link
        })
        return
      }

      createNotification({ imageUrl: coverImage, title, description, link })
    } catch (error: any) {
      console.error(error)
      setToaster({
        isOpen: true,
        message: error.message || 'Erro ao criar notificação',
        type: 'error'
      })
    } finally {
      setLoadingCreateNotification(false)
      handleClose()
    }
  }

  useEffect(() => {
    if (!currentNotification) return
    setCoverImage(currentNotification.imageUrl || undefined)
    reset({
      title: currentNotification.title || '',
      description: currentNotification.description || '',
      link: currentNotification.link || ''
    })
  }, [currentNotification, reset])

  return (
    <Modal open={isModalOpen} onClose={handleClose} sx={{ p: 4 }}>
      <>
        {!loadingCreateNotification && (
          <Card
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isMobile ? '100%' : 500
            }}
          >
            <CardContent>
              {!onlyView && (
                <Typography variant="h6" component="div" gutterBottom>
                  {currentNotification ? 'Atualizar ' : 'Criar '} notificação
                </Typography>
              )}

              {onlyView && (
                <Typography variant="h6" component="div" gutterBottom>
                  Notificação
                </Typography>
              )}

              <form onSubmit={handleSubmit(createOrUpdateNotification)}>
                {!coverImage && !loading && !onlyView && (
                  <div className="mt-6 mb-2">
                    <Uploader
                      uploadFile={handleFileUpload}
                      label="Adicionar Capa:"
                      description="Click para adicionar uma imagem."
                      extensionsMessage="Recomendamos imagem 480x280 e peso até 5mb"
                    />
                  </div>
                )}
                {!coverImage && loading && (
                  <div className="mt-6 h-32 flex items-center justify-center rounded-lg border border-dashed border-gray-900/25 ">
                    <CircularProgress />
                  </div>
                )}
                {coverImage && (
                  <div className="mt-6 mb-2 relative">
                    {isAdmin && !onlyView && (
                      <IconButton
                        style={{ zIndex: 1 }}
                        className="absolute right-0 top-0 m-1 hover:bg-red-500 hover:text-white"
                        onClick={() => setCoverImage(undefined)}
                      >
                        <HighlightOffIcon />
                      </IconButton>
                    )}
                    <Image
                      alt="Imagem capa da notificação"
                      src={coverImage}
                      width="480"
                      height="280"
                      style={{
                        width: '480',
                        maxHeight: '280px',
                        objectFit: 'scale-down',
                        objectPosition: 'center',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                )}

                <TextField
                  label="Título"
                  fullWidth
                  margin="normal"
                  disabled={onlyView || !isAdmin}
                  {...register('title')}
                />
                {errors.title && (
                  <span className=" text-red-500 text-sm">
                    {errors.title.message}
                  </span>
                )}

                <TextField
                  label={descriptionLabel}
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  disabled={onlyView || !isAdmin}
                  {...register('description')}
                />
                {errors.description && (
                  <span className=" text-red-500 text-sm">
                    {errors.description.message}
                  </span>
                )}
                {!onlyView && (
                  <>
                    <TextField
                      label="ex: https://google.com"
                      fullWidth
                      margin="normal"
                      disabled={onlyView || !isAdmin}
                      {...register('link')}
                    />
                    {errors.link && (
                      <span className=" text-red-500 text-sm">
                        {errors.link.message}
                      </span>
                    )}
                  </>
                )}

                {currentNotification &&
                  currentNotification.link &&
                  onlyView && (
                    <CardActions>
                      <Button size="small">
                        <a
                          href={currentNotification.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          ABRIR LINK
                        </a>
                      </Button>
                    </CardActions>
                  )}

                {isAdmin && !onlyView && (
                  <div className="mt-4 flex flex-row-reverse justify-between">
                    <Button type="submit" variant="contained" color="primary">
                      {currentNotification ? 'Atualizar' : 'Criar'}
                    </Button>
                    {isMobile && (
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={handleClose}
                      >
                        Voltar
                      </Button>
                    )}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        )}
        {loadingCreateNotification && <LoadingScreen />}
      </>
    </Modal>
  )
}

export default NotificationCreateOrEditCard
