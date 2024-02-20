'use client'

import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

import CampaignTwoTone from '@mui/icons-material/CampaignTwoTone'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import {
  Avatar,
  Box,
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
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
  TableHead,
  Tooltip
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
import SidebarList from 'components/SidebarList'
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

export default function CatalogsList() {
  const TABLE_HEAD = [
    { id: 'image', label: 'Capa', align: 'center' },
    { id: 'title', label: 'Título', align: 'center' },
    { id: 'updatedAt', label: 'Atualizado em', align: 'center' },
    { id: 'active', label: 'Status', align: 'center' },
    { id: 'see', label: 'Baixar catálogo', align: 'center' },
    { id: 'actions', label: 'Ações', align: 'center' }
  ]

  const TABLE_HEAD_MOBILE = [
    { id: 'title', label: 'Título', align: 'center' },
    { id: 'active', label: 'Status', align: 'center' },
    { id: 'actions', label: 'Ações', align: 'center' }
  ]

  const router = useRouter()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { user } = useAuthStore((state) => state) as IAuthStore
  const [catalogsList, getAllCatalogs, handleCatalogActive, deleteCatalog] =
    useMainStore((state) => [
      state.catalogsList,
      state.getAllCatalogs,
      state.handleCatalogActive,
      state.deleteCatalog
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

  const [currentCatalog, setCurrentCatalog] = useState<{
    id: string
    active: boolean
  } | null>(null)

  const [catalogsListAdapted, setCatalogsListAdapted] = useState<DataList[]>([])
  const [filteredCatalogs, setFilteredCatalogs] = useState<DataList[]>([])

  const [openOrderListing, setOpenOrderListing] = useState(false)
  const [isSysAdmin, setIsSysAdmin] = useState(false)
  const [isModalOpen, setOpenModal] = useState(false)
  const [showDeletePrompt, setShowDeletePrompt] = useState(false)
  const [itemToBeDeleted, setItemToBeDeleted] = useState<string>('')
  const [catalog, setCatalog] = useState<{
    id: string
    title: string
    medias: mediaObject[]
  }>({ id: '', title: '', medias: [] })

  const handleEdit = async (id: string) => {
    router.push(`/in/catalogs/${id}`)
  }

  const handleOpenMenu = (
    event: any,
    { id, active }: { id: string; active: boolean }
  ) => {
    setAnchorEl(event.currentTarget)
    setCurrentCatalog({ id, active })
  }

  const handleClose = () => {
    setAnchorEl(null)
    setCurrentCatalog(null)
  }

  const openViewer = async (id: string) => {
    const catalog =
      catalogsList && catalogsList.find((catalog) => catalog.id === id)
    const media = catalog?.medias

    if (!media?.length) {
      setToaster({
        isOpen: true,
        message: 'Nenhuma media encontrada',
        type: 'warning'
      })
      return
    }

    setCatalog({
      id: catalog?.id || '',
      title: catalog?.name || '',
      medias: mediasAdapter(catalog?.medias || [])
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
      deleteCatalog(itemToBeDeleted)
    }

    setShowDeletePrompt(!showDeletePrompt)
  }

  function showPrompt(id: string) {
    setShowDeletePrompt(true)
    setItemToBeDeleted(id)
    handleClose()
  }

  function handleCatalogStatus(id: string, active: boolean) {
    handleCatalogActive(id, active)
    setAnchorEl(null)
  }

  function defineCover(medias: any[]) {
    const imagesList = medias.filter((media) => media.type === 'image')
    const cover = imagesList?.find((image) => image.cover === true)

    return cover?.url || null
  }

  const initCatalogsList = useCallback(async () => {
    const catalogsAdapted =
      catalogsList &&
      catalogsList
        .map((catalog) => ({
          id: catalog.id,
          name: catalog.name,
          description: catalog.description || null,
          active: catalog.active,
          documents: catalog.documents,
          img: {
            source: defineCover(catalog?.medias),
            alt: `Image ${catalog.name} `
          },
          updatedAt: catalog.updatedAt
        }))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    catalogsAdapted && setCatalogsListAdapted(catalogsAdapted)
    catalogsAdapted && setFilteredCatalogs(catalogsAdapted)
  }, [catalogsList, setCatalogsListAdapted, page, rowsPerPage])

  const searchByName = (searchQuery: string) => {
    const filteredCatalogs = catalogsListAdapted.filter((catalog) => {
      const catalogName = catalog.name.toLowerCase()
      const query = searchQuery.toLowerCase()
      return catalogName.includes(query)
    })

    setFilteredCatalogs(filteredCatalogs)
  }

  useEffect(() => {
    initCatalogsList()
  }, [initCatalogsList, catalogsList])

  useEffect(() => {
    if (catalogsList) {
      initCatalogsList()
      return
    }
    getAllCatalogs()
  }, [getAllCatalogs, catalogsList, initCatalogsList])

  useEffect(() => {
    if (!user) return
    setIsSysAdmin(user.role >= ROLES.SYSTEM_ADMIN)
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
    <PageContainer pageTitle="Catálogos" pageSection="catalogs">
      {loading && <LoadingScreen />}
      <Paper
        sx={{ width: '100%', border: `solid 1px ${theme.palette.divider}` }}
      >
        <SearchTableCustom onSearch={searchByName} />
        <TableContainer sx={{ maxHeight: '56vh' }}>
          <Table stickyHeader>
            {!!filteredCatalogs?.length && (
              <TableHead>
                {!isMobile && <TableHeadCustom headLabel={TABLE_HEAD} />}

                {isMobile && <TableHeadCustom headLabel={TABLE_HEAD_MOBILE} />}
              </TableHead>
            )}

            <TableBody>
              {filteredCatalogs &&
                filteredCatalogs.map((row: any) => {
                  const { id, img, name, active, updatedAt, documents } = row

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
                          {!img.source && <CampaignTwoTone fontSize="large" />}
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
                        <Box
                          aria-label="visibility"
                          onClick={(event) => {
                            event.stopPropagation()
                          }}
                          sx={{
                            '&:hover': { backgroundColor: 'transparent' }
                          }}
                        >
                          {documents[0]?.url ? (
                            <a
                              href={documents[0].url}
                              download
                              target="_blank"
                              rel="noreferrer"
                            >
                              <IconButton>
                                <DownloadIcon
                                  sx={{
                                    '&:hover': { color: 'black !important' }
                                  }}
                                />
                              </IconButton>
                            </a>
                          ) : (
                            <IconButton
                              disabled
                              sx={{
                                '&:hover': { backgroundColor: 'transparent' }
                              }}
                            >
                              <DownloadIcon />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>

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
                    </TableRow>
                  )
                })}
              {!loading &&
                filteredCatalogs &&
                filteredCatalogs.length === 0 && (
                  <TableRow tabIndex={-1} role="checkbox" sx={{ px: 2 }}>
                    <TableCell
                      size="small"
                      component="th"
                      scope="row"
                      align="center"
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        Nenhum catálogo encontrado
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <PaginationTableCustom tableItems={catalogsList} />
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
          onClick={() => {
            setOpenOrderListing(true)
            handleClose()
          }}
        >
          <IconButton aria-label="buy">
            <ShoppingCartIcon />
          </IconButton>
          Comprar
        </MenuItem>
        <MenuItem
          onClick={() => currentCatalog && handleEdit(currentCatalog.id)}
        >
          <IconButton aria-label="edit">
            <EditIcon />
          </IconButton>
          {isSysAdmin ? 'Editar' : 'Visualizar'}
        </MenuItem>
        {isSysAdmin && (
          <>
            <MenuItem
              onClick={() =>
                currentCatalog &&
                handleCatalogStatus(currentCatalog.id, !currentCatalog.active)
              }
            >
              <IconButton aria-label="activation">
                <ToggleOnIcon />
              </IconButton>
              {currentCatalog?.active ? 'Desativar' : 'Ativar'}
            </MenuItem>
            <MenuItem
              sx={{ color: 'error.main' }}
              onClick={() => currentCatalog && showPrompt(currentCatalog.id)}
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
          modelValue={catalog}
          module="catalog"
          open={isModalOpen}
          setOpen={setOpenModal}
        />
      )}

      <SidebarList
        handleDrawer={setOpenOrderListing}
        isOpen={openOrderListing}
        onCreateItem={() => setOpenOrderListing(false)}
      />

      <DeleteDoubleCheck
        title="Confirmar exclusão?"
        open={showDeletePrompt}
        closeDoubleCheck={() => setShowDeletePrompt(false)}
        deleteItem={deleteItem}
      />
    </PageContainer>
  )
}
