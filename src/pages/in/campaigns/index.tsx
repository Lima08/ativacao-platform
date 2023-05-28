'use client'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

import CampaignIcon from '@mui/icons-material/Campaign'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Avatar,
  Card,
  Chip,
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
import type { ICampaignCreated } from 'interfaces/entities/campaign'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'
import DashboardLayout from 'wrappers/DashboardLayout'

import Modal from 'components/MediaViewer'
import PageContainer from 'components/PageContainer'
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

export default function CampaignsList() {
  const TABLE_HEAD = [
    { id: 'image', label: 'Capa', align: 'center' },
    { id: 'title', label: 'Título', align: 'left' },
    { id: 'updatedAt', label: 'Atualizado em', align: 'left' },
    { id: 'active', label: 'Status', align: 'left' },
    { id: 'see', label: 'Ver campanha', align: 'left' },
    { id: 'actions', label: 'Ações', align: 'right' }
  ]
  const router = useRouter()

  const [error, setToaster] = useGlobalStore((state) => [
    state.error,
    state.setToaster
  ])
  const [campaignsList, getAllCampaigns, handleCampaignActive, deleteCampaign] =
    useMainStore((state) => [
      state.campaignsList,
      state.getAllCampaigns,
      state.handleCampaignActive,
      state.deleteCampaign
    ])

  const [anchorEl, setAnchorEl] = useState<null | (EventTarget & Element)>(null)
  const openPopover = Boolean(anchorEl)

  const [currentCampaign, setCurrentCampaign] = useState<{
    id: string
    active: boolean
  } | null>(null)
  const [campaignsListAdapted, setCampaignsListAdapted] = useState<DataList[]>(
    []
  )
  const [isModalOpen, setOpenModal] = useState(false)
  const [campaign, setCampaign] = useState<{
    title: string
    description: string
    media: mediaObject[]
  }>({ title: '', description: '', media: [] })

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
  const onClickRow = async (id: string) => {
    const campaign = campaignsList.find((campaign) => campaign.id === id)
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
      title: campaign?.name || '',
      description: campaign?.description || '',
      media: mediasAdapter(campaign?.medias || [])
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

  function defineCover(medias: any[]) {
    const cover = medias.find((media) => media.type === 'image')
    return cover?.url || null
  }

  function campaignsAdapter(campaignsList: ICampaignCreated[]) {
    const campaignsAdapted = campaignsList.map((campaign) => {
      return {
        id: campaign.id,
        name: campaign.name,
        description: campaign.description || null,
        active: campaign.active,
        img: {
          source: defineCover(campaign?.medias),
          alt: `Image ${campaign.name} `
        },
        updatedAt: campaign.updatedAt
      }
    })

    return campaignsAdapted
  }

  function deleteItem(id: string) {
    const userDecision = confirm('Confirmar deleção?')

    if (userDecision) {
      deleteCampaign(id)
    }
  }

  function handleCampaignStatus(id: string, active: boolean) {
    handleCampaignActive(id, active)
    setAnchorEl(null)
  }

  useEffect(() => {
    if (!error) return
    setToaster({
      isOpen: true,
      message: 'Um erro inesperado ocorreu.',
      type: 'error',
      duration: 5000
    })
  }, [error, setToaster])

  const initCampaignsList = useCallback(async () => {
    if (!campaignsList) return

    const campaignsAdapted = campaignsAdapter(campaignsList)
    setCampaignsListAdapted(campaignsAdapted)
  }, [campaignsList, setCampaignsListAdapted, campaignsAdapter])
  useEffect(() => {
    initCampaignsList()
  }, [initCampaignsList])

  useEffect(() => {
    getAllCampaigns()
  }, [getAllCampaigns])

  return (
    <DashboardLayout>
      <PageContainer pageTitle="Campanhas" pageSection="campaigns">
        <Card>
          {/* // TODO: Pensar em mobile */}
          <TableContainer sx={{ minWidth: 600 }}>
            <Table>
              <TableHeadCustom headLabel={TABLE_HEAD} />
              <TableBody>
                {campaignsListAdapted &&
                  campaignsListAdapted.map((row: any) => {
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
                          {!img.source && (
                            <Stack alignItems="center" justifyContent="center">
                              <CampaignIcon fontSize="large" />
                            </Stack>
                          )}
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
                          <IconButton aria-label="active" size="large">
                            <Chip
                              label={active ? 'Ativo' : 'Desativo'}
                              color={active ? 'success' : 'error'}
                            />
                          </IconButton>
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
            onClick={() => currentCampaign && handleEdit(currentCampaign.id)}
          >
            <IconButton aria-label="edit">
              <EditIcon />
            </IconButton>
            Editar
          </MenuItem>
          <MenuItem
            onClick={() =>
              currentCampaign &&
              handleCampaignStatus(currentCampaign.id, !currentCampaign.active)
            }
          >
            <IconButton aria-label="activation">
              <ToggleOnIcon />
            </IconButton>
            {currentCampaign?.active ? 'Desativar' : 'Ativar'}
          </MenuItem>
          <MenuItem
            sx={{ color: 'error.main' }}
            onClick={() => currentCampaign && deleteItem(currentCampaign.id)}
          >
            <IconButton aria-label="delete" sx={{ color: 'error.main' }}>
              <DeleteIcon />
            </IconButton>
            Deletar
          </MenuItem>
        </Popover>

        {isModalOpen && (
          <Modal
            title={campaign.title}
            description={campaign.description}
            imageSource={
              campaign.media[0].type === 'image'
                ? campaign.media[0]
                : 'default img src'
            }
            medias={campaign.media}
            open={isModalOpen}
            setOpen={setOpenModal}
          />
        )}
      </PageContainer>
    </DashboardLayout>
  )
}
