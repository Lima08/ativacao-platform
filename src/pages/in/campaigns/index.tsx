'use client'

import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

import CampaignIcon from '@mui/icons-material/Campaign'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
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

export default function CampaignsList() {
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
    { id: 'see', label: 'Visualizar', align: 'center' },
    { id: 'actions', label: 'Ações', align: 'center', onlyAdmin: true }
  ]

  const router = useRouter()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { user } = useAuthStore((state) => state) as IAuthStore
  const [campaignsList, getAllCampaigns, handleCampaignActive, deleteCampaign] =
    useMainStore((state) => [
      state.campaignsList,
      state.getAllCampaigns,
      state.handleCampaignActive,
      state.deleteCampaign
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

  const [currentCampaign, setCurrentCampaign] = useState<{
    id: string
    active: boolean
  } | null>(null)

  const [campaignsListAdapted, setCampaignsListAdapted] = useState<DataList[]>(
    []
  )
  const [filteredCampaigns, setFilteredCampaigns] = useState<DataList[]>([])

  const [isAdmin, setIsAdmin] = useState(false)
  const [isModalOpen, setOpenModal] = useState(false)
  const [showDeletePrompt, setShowDeletePrompt] = useState(false)
  const [itemToBeDeleted, setItemToBeDeleted] = useState<string>('')
  const [campaign, setCampaign] = useState<{
    id: string
    title: string
    medias: mediaObject[]
  }>({ id: '', title: '', medias: [] })

  const handleEdit = async (id: string) => {
    router.push(`/in/campaigns/${id}`)
  }

  const handleOpenMenu = (
    event: any,
    { id, active }: { id: string; active: boolean }
  ) => {
    setAnchorEl(event.currentTarget)
    setCurrentCampaign({ id, active })
  }

  const handleClose = () => {
    setAnchorEl(null)
    setCurrentCampaign(null)
  }

  const openViewer = async (id: string) => {
    const campaign =
      campaignsList && campaignsList.find((campaign) => campaign.id === id)
    const media = campaign?.medias

    if (!media?.length) {
      setToaster({
        isOpen: true,
        message: 'Nenhuma media encontrada',
        type: 'warning'
      })
      return
    }

    setCampaign({
      id: campaign?.id || '',
      title: campaign?.name || '',
      medias: mediasAdapter(campaign?.medias || [])
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
      deleteCampaign(itemToBeDeleted)
    }

    setShowDeletePrompt(!showDeletePrompt)
  }

  function showPrompt(id: string) {
    setShowDeletePrompt(true)
    setItemToBeDeleted(id)
    handleClose()
  }

  function handleCampaignStatus(id: string, active: boolean) {
    handleCampaignActive(id, active)
    setAnchorEl(null)
  }

  function defineCover(medias: any[]) {
    const imagesList = medias.filter((media) => media.type === 'image')
    const cover = imagesList?.find((image) => image.cover === true)

    return cover?.url || null
  }

  const initCampaignsList = useCallback(async () => {
    const campaignsAdapted =
      campaignsList &&
      campaignsList
        .map((campaign) => ({
          id: campaign.id,
          name: campaign.name,
          description: campaign.description || null,
          active: campaign.active,
          img: {
            source: defineCover(campaign?.medias),
            alt: `Image ${campaign.name} `
          },
          updatedAt: campaign.updatedAt
        }))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    campaignsAdapted && setCampaignsListAdapted(campaignsAdapted)
    campaignsAdapted && setFilteredCampaigns(campaignsAdapted)
  }, [campaignsList, setCampaignsListAdapted, page, rowsPerPage])

  const searchByName = (searchQuery: string) => {
    const filteredCampaigns = campaignsListAdapted.filter((campaign) => {
      const campaignName = campaign.name.toLowerCase()
      const query = searchQuery.toLowerCase()
      return campaignName.includes(query)
    })

    setFilteredCampaigns(filteredCampaigns)
  }

  useEffect(() => {
    initCampaignsList()
  }, [initCampaignsList, campaignsList])

  useEffect(() => {
    if (campaignsList) {
      initCampaignsList()
      return
    }
    getAllCampaigns()
  }, [getAllCampaigns, campaignsList, initCampaignsList])

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
    <PageContainer pageTitle="Campanhas" pageSection="campaigns">
      {loading && <LoadingScreen />}
      <Paper
        sx={{ width: '100%', border: `solid 1px ${theme.palette.divider}` }}
      >
        <SearchTableCustom onSearch={searchByName} />
        <TableContainer sx={{ maxHeight: '56vh' }}>
          <Table stickyHeader>
            {!!filteredCampaigns?.length && (
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
              {filteredCampaigns &&
                filteredCampaigns.map((row: any) => {
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
                        <TableCell
                          size="small"
                          component="th"
                          scope="row"
                          align="center"
                        >
                          {img.source && (
                            <Stack alignItems="center" justifyContent="center">
                              <Avatar src={img.source} />
                            </Stack>
                          )}
                          {!img.source && <CampaignIcon fontSize="large" />}
                        </TableCell>
                      )}

                      <TableCell
                        size="small"
                        component="th"
                        scope="row"
                        align="center"
                        sx={{
                          maxWidth: `${isMobile ? '100px' : '200px'}`
                        }}
                      >
                        <Tooltip title={name}>
                          <Typography
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            variant="subtitle2"
                          >
                            {name}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      {!isMobile && (
                        <>
                          <TableCell
                            size="small"
                            component="th"
                            scope="row"
                            align="center"
                          >
                            {formatDate(updatedAt)}
                          </TableCell>
                          <TableCell
                            size="small"
                            component="th"
                            scope="row"
                            align="center"
                          >
                            <Chip
                              label={active ? 'Ativo' : 'Desativo'}
                              color={active ? 'success' : 'error'}
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                        </>
                      )}
                      <TableCell
                        size="small"
                        component="th"
                        scope="row"
                        align="center"
                      >
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

                      {isAdmin && (
                        <TableCell
                          size="small"
                          component="th"
                          scope="row"
                          align="center"
                        >
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
                filteredCampaigns &&
                filteredCampaigns.length === 0 && (
                  <TableRow tabIndex={-1} role="checkbox" sx={{ px: 2 }}>
                    <TableCell
                      size="small"
                      component="th"
                      scope="row"
                      align="center"
                    >
                      <Typography variant="subtitle2">
                        Nenhuma campanha encontrada
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <PaginationTableCustom tableItems={campaignsList} />
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
          onClick={() => currentCampaign && handleEdit(currentCampaign.id)}
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
                currentCampaign &&
                handleCampaignStatus(
                  currentCampaign.id,
                  !currentCampaign.active
                )
              }
            >
              <IconButton aria-label="activation">
                <ToggleOnIcon />
              </IconButton>
              {currentCampaign?.active ? 'Desativar' : 'Ativar'}
            </MenuItem>
            <MenuItem
              sx={{ color: 'error.main' }}
              onClick={() => currentCampaign && showPrompt(currentCampaign.id)}
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
          modelValue={campaign}
          module="campaign"
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
