'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import InsightsIcon from '@mui/icons-material/Insights'
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Avatar,
  Card,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import type { ITrainingCreated } from 'interfaces/entities/training'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import Modal from 'components/MediaViewer'
import PageContainer from 'components/PageContainer'
import PaginationTableCustom from 'components/TableCustom/PaginationTableCustom'
import SearchTableCustom from 'components/TableCustom/SearchTableCustom'
import TableHeadCustom from 'components/TableCustom/TableHeadCustom'

import { formatDate } from '../../../../utils'

interface mediaObject {
  url: string
  type: string
}

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
    { id: 'title', label: 'Título', align: 'left' },
    { id: 'updatedAt', label: 'Atualizado em', align: 'left' },
    { id: 'active', label: 'Status', align: 'left' },
    { id: 'see', label: 'Ver treinamento', align: 'left' },
    { id: 'actions', label: 'Ações', align: 'right' }
  ]

  const router = useRouter()
  const [trainingsList, getAllTrainings, handleTrainingActive, deleteTraining] =
    useMainStore((state) => [
      state.trainingsList,
      state.getAllTrainings,
      state.handleTrainingActive,
      state.deleteTraining
    ])
  const [anchorEl, setAnchorEl] = useState<null | (EventTarget & Element)>(null)
  const openPopover = Boolean(anchorEl)

  const [currentTraining, setCurrentTraining] = useState<{
    id: string
    active: boolean
  } | null>(null)

  const { user } = useAuthStore((state) => state) as IAuthStore
  const [isAdmin, setIsAdmin] = useState(false)
  const [filteredTrainings, setFilteredTrainings] = useState<DataList[]>([])
  const [trainingListAdapted, setTrainingListAdapted] = useState<DataList[]>([])
  const [error, setToaster, page, rowsPerPage] = useGlobalStore((state) => [
    state.error,
    state.setToaster,
    state.page,
    state.rowsPerPage
  ])

  const [isModalOpen, setOpenModal] = useState(false)

  const [training, setTraining] = useState<{
    title: string
    active: boolean
    description: string
    media: mediaObject[]
  }>({ title: '', active: true, description: '', media: [] })

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
  const onClickRow = async (id: string) => {
    const training = trainingsList.find((training) => training.id === id)
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
      title: training?.name || '',
      active: training?.active || false,
      description: training?.description || '',
      media: mediasAdapter(training?.medias || [])
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

  function deleteItem(id: string) {
    const userDecision = confirm('Confirmar deleção?')

    if (userDecision) {
      deleteTraining(id)
    }
  }

  function handleTrainingStatus(id: string, active: boolean) {
    handleTrainingActive(id, active)
    setAnchorEl(null)
  }

  const initTrainingsList = useCallback(async () => {
    if (!trainingsList || trainingsList.length === 0) return

    function defineCover(medias: any[]) {
      const cover = medias.find((media) => media.type === 'image')
      return cover?.url || null
    }

    function trainingsAdapter(trainingList: ITrainingCreated[]) {
      return trainingList
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
    }

    const trainingAdapted = trainingsAdapter(trainingsList)
    setTrainingListAdapted(trainingAdapted)
    setFilteredTrainings(trainingAdapted)
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
    if (trainingsList.length > 0) return
    getAllTrainings()
  }, [getAllTrainings, trainingsList])

  useEffect(() => {
    if (!user) return
    setIsAdmin(user.role >= ROLES.COMPANY_ADMIN)
  }, [user])

  useEffect(() => {
    initTrainingsList()
  }, [initTrainingsList])

  useEffect(() => {
    if (!error) return
    setToaster({
      isOpen: true,
      message: 'Um erro inesperado ocorreu.',
      type: 'error',
      duration: 5000
    })
  }, [error, setToaster])

  return (
    <PageContainer pageTitle="Treinamentos" pageSection="trainings">
      <Card>
        {/* // TODO: Pensar em mobile */}
        <TableContainer sx={{ maxHeight: '68vh' }}>
          <SearchTableCustom onSearch={searchByName} />

          <Table>
            <TableHeadCustom headLabel={TABLE_HEAD} />
            <TableBody>
              {filteredTrainings &&
                filteredTrainings.map((row: any) => {
                  const { id, img, name, active, updatedAt } = row

                  return (
                    <TableRow hover key={id} tabIndex={-1} role="checkbox">
                      <TableCell
                        align="center"
                        sx={{ px: 1 }}
                        component="th"
                        scope="row"
                      >
                        {img.source && (
                          <Stack alignItems="center" justifyContent="center">
                            <Avatar
                              variant="square"
                              src={img.source}
                              sx={{
                                width: 70,
                                height: 70
                              }}
                            />
                          </Stack>
                        )}
                        {!img.source && <InsightsIcon fontSize="large" />}
                      </TableCell>
                      <TableCell align="left">
                        <Stack direction="row" alignItems="center">
                          <Typography variant="subtitle2">{name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">
                        {formatDate(updatedAt)}
                      </TableCell>
                      <TableCell align="left">
                        <Chip
                          label={active ? 'Ativo' : 'Desativo'}
                          color={active ? 'success' : 'error'}
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell align="left">
                        {active && (
                          <IconButton
                            aria-label="visibility"
                            size="large"
                            onClick={() => onClickRow(id)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        )}
                        {!active && (
                          <IconButton
                            aria-label="visibility"
                            size="large"
                            disabled
                          >
                            <VisibilityOffIcon />
                          </IconButton>
                        )}
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          size="large"
                          color="inherit"
                          onClick={(event) =>
                            handleOpenMenu(event, { active, id })
                          }
                        >
                          <MoreVertSharpIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />
        <PaginationTableCustom tableItems={trainingsList} />
      </Card>

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
          Editar
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
              onClick={() => currentTraining && deleteItem(currentTraining.id)}
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
        <Modal
          title={training.title}
          description={training.description}
          imageSource={
            training.media[0].type === 'image'
              ? training.media[0]
              : 'default img src'
          }
          medias={training.media}
          open={isModalOpen}
          setOpen={setOpenModal}
        />
      )}
    </PageContainer>
  )
}
