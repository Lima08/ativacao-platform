import { useCallback, useEffect, useState } from 'react'

import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  InputLabel,
  Tab,
  Link,
  Tabs,
  TextField,
  TextareaAutosize,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { useUpload } from 'hooks/useUpload'
import { IDocumentCreated } from 'interfaces/entities/document'
import { IMediaCreated } from 'interfaces/entities/media'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'
import useGlobalStore from 'store/useGlobalStore'

import FileList from 'components/FileList'
import LoadingScreen from 'components/LoadingScreen'
import MediaList from 'components/MediaList'
import Uploader from 'components/Uploader'

type PageRegisterProps = {
  pageTitle: string
  currentItem?: any
  submit: (item: any) => void
  resetState: () => void
  goBack: () => void
  showDocumentTab?: boolean
}

export default function PageRegisterTab({
  pageTitle,
  currentItem,
  submit,
  resetState,
  goBack,
  showDocumentTab
}: PageRegisterProps) {
  const { user } = useAuthStore((state) => state) as IAuthStore
  const [loading, setToaster, uploadPercentage, resetUploadPercentage] =
    useGlobalStore((state) => [
      state.loading,
      state.setToaster,
      state.uploadPercentage,
      state.resetUploadPercentage
    ])

  const { uploadVideo, uploadFiles, uploaderDocument } = useUpload()

  const [isAdmin, setIsAdmin] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemDescription, setItemDescription] = useState('')
  const [cover, setCover] = useState<IMediaCreated | null>(null)
  const [itemMedias, setItemMedias] = useState<IMediaCreated[]>([])
  const [itemImages, setItemImages] = useState<IMediaCreated[]>([])
  const [itemVideos, setItemVideos] = useState<IMediaCreated[]>([])
  const [mediasToExclude, setMediasToExclude] = useState<any[]>([])
  const [itemDocuments, setItemDocuments] = useState<IDocumentCreated[]>([])
  const [documentsToExclude, setDocumentsToExclude] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState(0)
  const [tabControl, setTabControl] = useState<{
    info: boolean
    image: boolean
    video: boolean
    document: boolean
  }>({ info: true, image: false, video: false, document: false })

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const filterMediasByType = useCallback(
    (type: string) => {
      return itemMedias.filter((media) => media.type === type)
    },
    [itemMedias]
  )

  const handleImageUpload = async (e: any, isCover = false) => {
    e.preventDefault()
    const files = e.target.files

    try {
      const imagesList = await uploadFiles(files, isCover)
      if (!imagesList) return

      setItemMedias((prevMediaList) => {
        return [...prevMediaList, ...imagesList]
      })
      setItemImages((prevImageList) => {
        return [...prevImageList, ...imagesList]
      })
    } catch (error) {
      console.error(error)
      return
    }
  }

  const handleVideoUpload = async (e: any) => {
    e.preventDefault()
    const file = e.target.files[0]

    try {
      const videoList = await uploadVideo(file)
      if (!videoList) return
      setItemMedias((prevMediaList) => {
        return [...prevMediaList, videoList]
      })
      setItemVideos((prevVideoList) => {
        return [...prevVideoList, videoList]
      })
    } catch (error) {
      console.error(error)
      return
    }
  }

  const handleDocumentUpload = async (e: any) => {
    e.preventDefault()
    const files = e.target.files

    try {
      const documentList = await uploaderDocument(files)
      if (!documentList) return

      documentList.forEach((document) => {
        setItemDocuments((prevDocumentList) => {
          return [...prevDocumentList, document]
        })
      })
    } catch (error) {
      console.error(error)
      return
    }
  }

  const resetItemState = useCallback(() => {
    setItemName('')
    setItemDescription('')
    setItemMedias([])
    setItemImages([])
    setItemVideos([])
    resetUploadPercentage()
    resetState()
  }, [setItemMedias, resetState, resetUploadPercentage])

  const submitItem = async (e: any) => {
    e.preventDefault()
    if (!itemName) {
      setToaster({
        isOpen: true,
        message: 'Nome é obrigatório!',
        type: 'warning'
      })
      return
    }

    const mediaIds = itemMedias.map((media) => media.id)
    const documentIds = itemDocuments.map((document) => document.id)

    submit({
      name: itemName,
      description: itemDescription,
      mediaIds,
      mediasToExclude,
      documentsToExclude,
      documentIds
    })

    resetItemState()
    setActiveTab(0)
    setTabControl({
      info: true,
      image: false,
      video: false,
      document: false
    })
  }

  const removeMedia = (id: string, type: string) => {
    const medias = itemMedias.filter((media) => media.id !== id)
    setItemMedias(medias)

    switch (type) {
      case 'image':
        setItemImages(filterMediasByType('image'))
        break

      case 'video':
        setItemVideos(filterMediasByType('video'))
        break

      default:
        break
    }
    setMediasToExclude((prevMedias) => [...prevMedias, id])
  }

  const removeDocument = (id: string) => {
    const documents = itemDocuments.filter((document) => document.id !== id)
    setItemDocuments(documents)

    setDocumentsToExclude((prevDocuments) => [...prevDocuments, id])
  }
  function handleTableClick(eventTabClick: any) {
    const activeTabIndex = eventTabClick.target.tabIndex

    setActiveTab(activeTabIndex)
    switch (activeTabIndex) {
      case 0:
        setTabControl({
          info: true,
          image: false,
          video: false,
          document: false
        })
        break
      case 1:
        setTabControl({
          info: false,
          image: true,
          video: false,
          document: false
        })
        break
      case 2:
        setTabControl({
          info: false,
          image: false,
          video: true,
          document: false
        })
        break
      case 3:
        setTabControl({
          info: false,
          image: false,
          video: false,
          document: true
        })
        break
      default:
        break
    }
  }

  function handleGoBack() {
    resetItemState()
    goBack()
  }

  useEffect(() => {
    if (!currentItem) return
    setItemName(currentItem.name)
    setItemDescription(currentItem?.description || '')
    setItemMedias(currentItem?.medias || [])
    setItemDocuments(currentItem?.documents || [])
  }, [currentItem])

  useEffect(() => {
    if (!itemMedias.length) {
      setItemImages([])
      setItemVideos([])
      return
    } else {
      setItemImages(filterMediasByType('image'))
      setItemVideos(filterMediasByType('video'))
    }
  }, [itemMedias, filterMediasByType])

  useEffect(() => {
    if (itemImages) {
      const coverImage = itemImages.find((image) => image.cover)
      if (coverImage) {
        setCover(coverImage)
      } else {
        setCover(null)
      }
    }
  }, [itemImages])

  useEffect(() => {
    if (!user || !user.role) return
    const isUserAdminRole = user.role >= ROLES.SYSTEM_ADMIN
    setIsAdmin(isUserAdminRole)

    if (isUserAdminRole) return
    setActiveTab(1)
    setTabControl({ info: false, image: true, video: false, document: false })
  }, [user])

  return (
    <div className="flex flex-col w-full items-center">
      <Tabs
        value={activeTab}
        onChange={handleTableClick}
        aria-label="Catalogs tabs"
      >
        <Tab label="Geral" tabIndex={0} />
        <Tab label="Imagens" tabIndex={1} />
        <Tab label="Vídeos" tabIndex={2} />
        {showDocumentTab && <Tab label="Arquivos" tabIndex={3} />}
      </Tabs>

      <div className="container flex flex-col gap-4">
        <Grid container>
          <Grid item xs={12}>
            <Card sx={{ mx: 2, pb: 8, p: 2, height: '100%' }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap={4}
              >
                {!isMobile && <Typography variant="h6">{pageTitle}</Typography>}

                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                  gap={4}
                  width="100%"
                >
                  {isAdmin && (
                    <Button
                      disabled={loading || !itemName}
                      variant="contained"
                      onClick={submitItem}
                    >
                      Salvar
                    </Button>
                  )}

                  <Button onClick={handleGoBack} variant="outlined">
                    Voltar
                  </Button>
                </Box>
              </Box>
              {isAdmin && tabControl.info && (
                <div className="mt-6 flex flex-col  justify-center">
                  <Box
                    sx={{
                      width: isMobile ? '100%' : 150,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {!cover && (
                      <Uploader
                        uploadFile={(e) => handleImageUpload(e, true)}
                        label="Capa:"
                        type="image"
                        description="Adicione uma imagem de capa"
                      />
                    )}
                    {!!cover && (
                      <MediaList
                        width={120}
                        height={120}
                        mediasList={[cover]}
                        onDelete={(id) => removeMedia(id, 'image')}
                      />
                    )}
                  </Box>

                  <Box className="my-4 w-full">
                    <InputLabel
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Título:
                    </InputLabel>
                    <TextField
                      id="name"
                      name="name"
                      variant="outlined"
                      type="text"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      disabled={!isAdmin}
                      fullWidth
                    />

                    <InputLabel
                      htmlFor="description"
                      className="block text-sm font-medium leading-6 text-gray-900 mt-4"
                    >
                      Descrição:
                    </InputLabel>
                    <TextareaAutosize
                      id="description"
                      name="Descrição"
                      aria-label="minimum height"
                      minRows={6}
                      placeholder={
                        isAdmin
                          ? 'Adicione aqui detalhes sobre esse item...'
                          : ''
                      }
                      value={itemDescription}
                      onChange={(e) => setItemDescription(e.target.value)}
                      disabled={!isAdmin}
                      className="w-full rounded-md border-0 px-2 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset outline-none focus:ring-blue-500  sm:leading-6  font-sans"
                    />
                  </Box>
                </div>
              )}

              {tabControl.image && (
                <div className="mt-8">
                  {!!isAdmin && (
                    <Uploader
                      uploadFile={handleImageUpload}
                      label="Adicionar Imagens:"
                      type="image"
                      multiple
                      description="Click para adicionar imagens."
                      extensionsMessage="Recomendamos imagens com dimensões máximas de 980x560 e peso até 5mb"
                    />
                  )}
                  {!!itemImages.length && (
                    <div className="mt-4">
                      <Divider sx={{ mt: 6, mb: 2 }}>
                        <Typography>Lista de Imagens</Typography>
                      </Divider>
                      <MediaList
                        mediasList={itemImages}
                        onDelete={(id) => removeMedia(id, 'image')}
                        showBadge
                      />
                    </div>
                  )}
                </div>
              )}

              {tabControl.video && (
                <div className="mt-8">
                  {!!isAdmin && (
                    <Uploader
                      uploadFile={handleVideoUpload}
                      label="Adicionar Vídeo:"
                      type="video"
                    />
                  )}
                  {!!itemVideos.length && (
                    <div className="mt-4">
                      <Divider sx={{ mt: 6, mb: 2 }}>
                        <Typography>Lista de Vídeos:</Typography>
                      </Divider>
                      <MediaList
                        mediasList={itemVideos}
                        onDelete={(id) => removeMedia(id, 'video')}
                        height="100%"
                        width="100%"
                      />
                    </div>
                  )}
                </div>
              )}
              {tabControl.document && (
                <div className="mt-8">
                  {itemDocuments.length > 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      {itemDocuments?.[0]?.url && (
                        <Box
                          sx={{
                            gap: 2,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Link
                            download
                            href={itemDocuments?.[0]?.url}
                            target="_blank"
                          >
                            <Button variant="contained" color="primary">
                              Ver catálogo
                            </Button>
                          </Link>
                          {isAdmin && (
                            <Button
                              variant="contained"
                              color="warning"
                              onClick={() =>
                                removeDocument(itemDocuments[0].id)
                              }
                            >
                              Remover
                            </Button>
                          )}
                        </Box>
                      )}
                    </Box>
                  ) : (
                    isAdmin && (
                      <Uploader
                        uploadFile={handleDocumentUpload}
                        label="Adicionar arquivo:"
                        type="document"
                        multiple
                      />
                    )
                  )}
                </div>
              )}
            </Card>
          </Grid>
          {/* <Grid item xs={4}>
            <Card
              sx={{
                mx: isMobile ? 2 : 4,
                pb: 8,
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box>
                <Link
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  mb={4}
                  width="100%"
                  download
                  href="https://s3.amazonaws.com/elasticbeanstalk-us-east-1"
                >
                  Ver catálogo
                </Link>
              </Box>
              <Button variant="contained" color="primary">
                Adicionar catálogo
              </Button>
              <Button variant="contained" color="warning">
                Remover catálogo
              </Button>
            </Card>
          </Grid> */}
        </Grid>
      </div>

      {loading && !uploadPercentage && <LoadingScreen />}
    </div>
  )
}
