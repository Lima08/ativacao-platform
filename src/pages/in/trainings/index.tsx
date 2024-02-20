'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import InsightsIcon from '@mui/icons-material/Insights'
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
  Avatar,
  Paper,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
  TableHead,
  Tooltip,
  Stack
} from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { FIVE_SECONDS } from 'constants/index'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import DeleteDoubleCheck from 'components/DeleteDoubleCheck'
import LoadingScreen from 'components/LoadingScreen'
import MediaViewer from 'components/MediaViewer'
import PageContainer from 'components/PageContainer'
import PaginationTableCustom from 'components/TableCustom/PaginationTableCustom'
import SearchTableCustom from 'components/TableCustom/SearchTableCustom'
import TableHeadCustom from 'components/TableCustom/TableHeadCustom'

import { mediaObject } from '../../../../types/IMediaObject'
import { formatDate } from '../../../../utils'

export type DataList = {
  id: string
  name: string
  description: string | null
  img: { source: string | null; alt: string }
  active: boolean
}

export default function TrainingsPage() {
  const TABLE_HEAD = [
    { id: 'image', label: 'Capa', align: 'center' },
    { id: 'title', label: 'Título', align: 'center' },
    { id: 'updatedAt', label: 'Atualizado em', align: 'center' },
    { id: 'active', label: 'Status', align: 'center' },
    { id: 'see', label: 'Visualizar', align: 'center' },
    { id: 'actions', label: 'Ações', align: 'center', onlyAdmin: true }
  ]

  const TABLE_HEAD_MOBILE = [
    { id: 'title', label: 'Título', align: 'center' },
    { id: 'active', label: 'Status', align: 'center' }
  ]

  const router = useRouter()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { user } = useAuthStore((state) => state) as IAuthStore
  const [trainingsList, getAllTrainings, handleTrainingActive, deleteTraining] =
    useMainStore((state) => [
      state.trainingsList,
      state.getAllTrainings,
      state.handleTrainingActive,
      state.deleteTraining
    ])

  const [loading, error, setToaster, page, rowsPerPage] = useGlobalStore(
    (state) => [
      state.loading,
      state.error,
      state.setToaster,
      state.page,
      state.rowsPerPage
    ]
  )

  const [anchorEl, setAnchorEl] = useState<null | (EventTarget & Element)>(null)
  const openPopover = Boolean(anchorEl)

  const [currentTraining, setCurrentTraining] = useState<{
    id: string
    active: boolean
  } | null>(null)

  const [filteredTrainings, setFilteredTrainings] = useState<DataList[]>([])
  const [trainingListAdapted, setTrainingListAdapted] = useState<DataList[]>([])
  const [showDeletePrompt, setShowDeletePrompt] = useState(false)
  const [itemToBeDeleted, setItemToBeDeleted] = useState<string>('')

  const [isAdmin, setIsAdmin] = useState(false)
  const [isModalOpen, setOpenModal] = useState(false)
  const [training, setTraining] = useState<{
    id: string
    title: string
    medias: mediaObject[]
  }>({ id: '', title: '', medias: [] })

  const handleEdit = async (id: string) => {
    router.push(`/in/trainings/${id}`)
  }

  const handleOpenMenu = (
    event: any,
    { id, active }: { id: string; active: boolean }
  ) => {
    setAnchorEl(event.currentTarget)
    setCurrentTraining({ id, active })
  }

  const handleClose = () => {
    setAnchorEl(null)
    setCurrentTraining(null)
  }

  const openViewer = async (id: string) => {
    const training =
      trainingsList && trainingsList.find((training) => training.id === id)
    const media = training?.medias

    if (!media?.length) {
      setToaster({
        isOpen: true,
        message: 'Nenhuma media encontrada',
        type: 'warning'
      })
      return
    }

    setTraining({
      id: training?.id || '',
      title: training?.name || '',
      medias: mediasAdapter(training?.medias || [])
    })

    setOpenModal(true)
  }

  function mediasAdapter(mediasList: any[]) {
    const mediaURLs = mediasList.map(({ url, type }) => ({
      url,
      type
    }))
    return mediaURLs
  }

  function deleteItem(decision: string) {
    if (decision === 'yes') {
      deleteTraining(itemToBeDeleted)
    }

    setShowDeletePrompt(!showDeletePrompt)
  }

  function showPrompt(id: string) {
    setShowDeletePrompt(true)
    setItemToBeDeleted(id)
    handleClose()
  }

  function handleTrainingStatus(id: string, active: boolean) {
    handleTrainingActive(id, active)
    setAnchorEl(null)
  }

  function defineCover(medias: any[]) {
    const imagesList = medias.filter((media) => media.type === 'image')
    const cover = imagesList?.find((image) => image.cover === true)

    return cover?.url || null
  }

  const initTrainingsList = useCallback(async () => {
    const trainingAdapted =
      trainingsList &&
      trainingsList
        .map((training) => ({
          id: training.id,
          name: training.name,
          description: training.description || null,
          active: training.active,
          img: {
            source: defineCover(training?.medias),
            alt: `Image ${training.name} `
          },
          updatedAt: training.updatedAt
        }))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    trainingAdapted && setTrainingListAdapted(trainingAdapted)
    trainingAdapted && setFilteredTrainings(trainingAdapted)
  }, [setTrainingListAdapted, trainingsList, page, rowsPerPage])

  const searchByName = (searchQuery: string) => {
    const filteredTrainings = trainingListAdapted.filter((training) => {
      const trainingName = training.name.toLowerCase()
      const query = searchQuery.toLowerCase()
      return trainingName.includes(query)
    })

    setFilteredTrainings(filteredTrainings)
  }

  useEffect(() => {
    initTrainingsList()
  }, [initTrainingsList])

  useEffect(() => {
    if (trainingsList) {
      initTrainingsList()
      return
    }
    getAllTrainings()
  }, [getAllTrainings, trainingsList, initTrainingsList])

  useEffect(() => {
    if (!user) return
    setIsAdmin(user.role >= ROLES.COMPANY_ADMIN)
  }, [user])

  useEffect(() => {
    if (!error) return
    console.error(error)

    setToaster({
      isOpen: true,
      message: error.message || 'Um erro inesperado ocorreu.',
      type: 'error',
      duration: FIVE_SECONDS
    })
  }, [error, setToaster])

  return (
    <PageContainer pageTitle="Treinamentos" pageSection="trainings">
      {loading && <LoadingScreen />}

      <Paper>
        <SearchTableCustom onSearch={searchByName} />
        <TableContainer sx={{ maxHeight: '56vh' }}>
          <Table stickyHeader>
            {!!filteredTrainings?.length && (
              <TableHead>
                {!isMobile && (
                  <TableHeadCustom headLabel={TABLE_HEAD} isAdmin={isAdmin} />
                )}

                {isMobile && (
                  <TableHeadCustom
                    headLabel={TABLE_HEAD_MOBILE}
                    isAdmin={isAdmin}
                  />
                )}
              </TableHead>
            )}
            <TableBody>
              {filteredTrainings &&
                filteredTrainings.map((row: any) => {
                  const { id, img, name, active, updatedAt } = row

                  return (
                    <TableRow
                      key={id}
                      sx={{ '$:hover': { cursor: 'pointer' } }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        openViewer(id)
                      }}
                    >
                      {!isMobile && (
                        <TableCell component="th" align="center" scope="row">
                          {img.source && (
                            <Stack alignItems="center" justifyContent="center">
                              <Avatar alt={name} src={img.source} />
                            </Stack>
                          )}
                          {!img.source && <InsightsIcon fontSize="large" />}
                        </TableCell>
                      )}

                      <TableCell
                        size="small"
                        align="center"
                        component="th"
                        sx={{
                          maxWidth: `${isMobile ? '100px' : '200px'}`
                        }}
                      >
                        <Tooltip title={name}>
                          <Typography
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              alignItems: 'center',
                              textAlign: 'center',
                              width: '100%'
                            }}
                            variant="subtitle2"
                          >
                            {name}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      {!isMobile && (
                        <>
                          <TableCell component="th" align="center">
                            {formatDate(updatedAt)}
                          </TableCell>
                          <TableCell align="center" component="th">
                            <Chip
                              label={active ? 'Ativo' : 'Desativo'}
                              color={active ? 'success' : 'error'}
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                        </>
                      )}
                      <TableCell size="small" align="center" component="th">
                        <IconButton
                          aria-label="visibility"
                          size="large"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleEdit(id)
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>

                      {isAdmin && !isMobile && (
                        <TableCell size="small" component="th" align="center">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleOpenMenu(event, { active, id })
                            }}
                          >
                            <MoreVertSharpIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
              {!loading &&
                filteredTrainings &&
                filteredTrainings.length === 0 && (
                  <TableRow sx={{ px: 2 }}>
                    <TableCell size="small" align="center" component="th">
                      <Typography variant="subtitle2">
                        Nenhum treinamento encontrado
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />
        <PaginationTableCustom tableItems={trainingsList} />
      </Paper>

      <Popover
        open={Boolean(openPopover)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 150,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75
            }
          }
        }}
      >
        <MenuItem
          onClick={() => currentTraining && handleEdit(currentTraining.id)}
        >
          <IconButton aria-label="edit">
            <EditIcon />
          </IconButton>
          {isAdmin ? 'Editar' : 'Visualizar'}
        </MenuItem>
        {isAdmin && (
          <>
            <MenuItem
              onClick={() =>
                currentTraining &&
                handleTrainingStatus(
                  currentTraining.id,
                  !currentTraining.active
                )
              }
            >
              <IconButton aria-label="activation">
                <ToggleOnIcon />
              </IconButton>
              {currentTraining?.active ? 'Desativar' : 'Ativar'}
            </MenuItem>
            <MenuItem
              sx={{ color: 'error.main' }}
              onClick={() => currentTraining && showPrompt(currentTraining.id)}
            >
              <IconButton aria-label="delete" sx={{ color: 'error.main' }}>
                <DeleteIcon />
              </IconButton>
              Deletar
            </MenuItem>
          </>
        )}
      </Popover>

      {isModalOpen && (
        <MediaViewer
          modelValue={training}
          module="training"
          open={isModalOpen}
          setOpen={setOpenModal}
        />
      )}
      <DeleteDoubleCheck
        title="Confirmar exclusão?"
        open={showDeletePrompt}
        closeDoubleCheck={() => setShowDeletePrompt(false)}
        deleteItem={deleteItem}
      />
    </PageContainer>
  )
}
