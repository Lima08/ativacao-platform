'use client'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp'
import SmsIcon from '@mui/icons-material/Sms'
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
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
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { IAnalysisCreated } from 'interfaces/entities/analysis'
import { eAnalysisStatusType } from 'interfaces/entities/analysis/EAnalysisStatus'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import AdminAnalysisRegister from 'components/AdminAnalysisRegister'
import ModalCustom from 'components/ModalCustom'
import PageContainer from 'components/PageContainer'
import PaginationTableCustom from 'components/TableCustom/PaginationTableCustom'
import SearchTableCustom from 'components/TableCustom/SearchTableCustom'
import TableHeadCustom from 'components/TableCustom/TableHeadCustom'
import UserAnalysisRegister from 'components/UserAnalysisRegister'

import { formatDate } from '../../../../utils'

enum eColorStatus {
  success = 'success',
  error = 'error',
  warning = 'warning'
}

type IAnalysisStatusType = {
  color: eColorStatus
  label: string
}

type IAnalyzesAdapted = {
  id: string
  title: string
  message?: string
  bucketUrl: string
  biUrl?: string
  status: IAnalysisStatusType
  updatedAt: Date
}

type AnalyzesObject = {
  id: string
  status: string
  date: string
  message?: string | undefined
  title: string
  bucketUrl: string
  biUrl: string
}

export default function AnalyzesTable() {
  const TABLE_HEAD = [
    { id: 'status', label: 'Status', align: 'left' },
    { id: 'title', label: 'Título', align: 'left' },
    { id: 'updatedAt', label: 'Atualizado em', align: 'left' },
    { id: 'bi', label: 'Visualizar', align: 'left' },
    { id: 'message', label: 'Mensagem', align: 'left' },
    { id: 'actions', label: 'Ações', align: 'right' }
  ]

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [loading, page, rowsPerPage] = useGlobalStore((state) => [
    state.loading,
    state.page,
    state.rowsPerPage
  ])
  const [analyzesList, getAllAnalyzes, deleteAnalysis] = useMainStore(
    (state) => [state.analyzesList, state.getAllAnalyzes, state.deleteAnalysis]
  )

  const [filteredAnalyzes, setFilteredAnalyzes] = useState<any[]>([])
  const [analyzesListAdapted, setAnalyzesListAdapted] = useState<any>([])
  const [currentAnalysis, setCurrentAnalysis] = useState<{
    id: string
    title: string
  } | null>(null)
  const [openUser, setOpenUser] = useState(false)
  const [openAdmin, setOpenAdmin] = useState(false)
  const [openOptions, setOpenOptions] = useState<any>(null)

  const analysisStatusAdapter = (
    status: eAnalysisStatusType
  ): IAnalysisStatusType => {
    const statusMappers = {
      done: { color: eColorStatus.success, label: 'Finalizado' },
      rejected: { color: eColorStatus.error, label: 'Rejeitado' },
      pending: { color: eColorStatus.warning, label: 'Pendente' }
    }

    return statusMappers[status]
  }

  const openCreateAnalysisModal = async () => {
    setOpenUser(true)
    setOpenOptions(null)
  }

  const openAdminAnalysisModal = async () => {
    setOpenAdmin(true)
    setOpenOptions(null)
  }

  const openMenu = (event: any, analysis: { id: string; title: string }) => {
    setOpenOptions(event.currentTarget)
    setCurrentAnalysis(analysis)
  }

  const closeMenu = () => {
    setOpenOptions(null)
    setCurrentAnalysis(null)
  }

  function deleteItem() {
    const userDecision = confirm('Deseja realmente deletar a análise?')

    if (userDecision && currentAnalysis) {
      deleteAnalysis(currentAnalysis.id)
    }
  }

  const startAnalyzesList = useCallback(() => {
    if (!analyzesList.length) return
    const analyzesAdapter = (
      analyzes: IAnalysisCreated[]
    ): IAnalyzesAdapted[] => {
      const result =
        analyzes.map((analysis) => ({
          id: analysis.id,
          title: analysis.title,
          message: analysis.message,
          bucketUrl: analysis.bucketUrl,
          biUrl: analysis.biUrl,
          status: analysisStatusAdapter(analysis.status),
          updatedAt: analysis.createdAt
        })) || []

      return result.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }

    const listAdapted = analyzesAdapter(analyzesList)
    setAnalyzesListAdapted(listAdapted)
    setFilteredAnalyzes(listAdapted)
  }, [setAnalyzesListAdapted, analyzesList, page, rowsPerPage])

  const searchByTitle = (searchQuery: string) => {
    const filteredAnalyzes = analyzesListAdapted.filter((analysis: any) => {
      const analysisTitle = analysis.title.toLowerCase()
      const query = searchQuery.toLowerCase()
      return analysisTitle.includes(query)
    })
    setFilteredAnalyzes(filteredAnalyzes)
  }

  useEffect(() => {
    getAllAnalyzes()
  }, [getAllAnalyzes])

  useEffect(() => {
    startAnalyzesList()
  }, [startAnalyzesList])

  return (
    <PageContainer
      pageTitle="Análises"
      pageSection="analyzes"
      customCallback={() => openCreateAnalysisModal()}
    >
      {loading && <div>Carregando...</div>}

      <Card>
        <TableContainer sx={{ maxHeight: '66vh' }}>
          <SearchTableCustom onSearch={searchByTitle} />

          <Table>
            {!isMobile && <TableHeadCustom headLabel={TABLE_HEAD} />}

            <TableBody>
              {filteredAnalyzes &&
                filteredAnalyzes.map((row: any) => {
                  const { id, title, message, biUrl, status, updatedAt } = row

                  return (
                    <TableRow hover key={id} tabIndex={-1} role="checkbox">
                      <TableCell
                        align="left"
                        sx={{ px: 1 }}
                        component="th"
                        scope="row"
                      >
                        <Chip label={status.label} color={status.color} />
                      </TableCell>
                      {!isMobile && (
                        <>
                          <TableCell align="left">
                            <Stack direction="row" alignItems="center">
                              <Typography variant="subtitle2">
                                {title}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">
                            {formatDate(updatedAt)}
                          </TableCell>
                        </>
                      )}
                      <TableCell align="left">
                        {biUrl && (
                          <Link href={`${biUrl}`} target="_blank">
                            <IconButton aria-label="bi" size="large">
                              <VisibilityIcon />
                            </IconButton>
                          </Link>
                        )}

                        {!biUrl && (
                          <IconButton aria-label="bi" size="large" disabled>
                            <VisibilityOffIcon />
                          </IconButton>
                        )}
                      </TableCell>
                      {!isMobile && (
                        <TableCell align="left">
                          {message && message.length > 1 && (
                            <IconButton aria-label="message" size="large">
                              <SmsIcon />
                            </IconButton>
                          )}

                          {!message && (
                            <IconButton
                              aria-label="message"
                              size="large"
                              disabled
                            >
                              <SpeakerNotesOffIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      )}

                      <TableCell align="right">
                        <IconButton
                          size="large"
                          color="inherit"
                          onClick={(event) => openMenu(event, { id, title })}
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
        <PaginationTableCustom tableItems={analyzesList} />
      </Card>

      <Popover
        open={Boolean(openOptions)}
        anchorEl={openOptions}
        onClose={() => closeMenu()}
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
        <MenuItem onClick={() => openAdminAnalysisModal()}>
          <IconButton aria-label="edit">
            <EditIcon />
          </IconButton>
          Analisar
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }} onClick={() => deleteItem()}>
          <IconButton aria-label="delete" sx={{ color: 'error.main' }}>
            <DeleteIcon />
          </IconButton>
          Deletar
        </MenuItem>
      </Popover>

      {openUser && (
        <ModalCustom closeModal={() => setOpenUser(false)}>
          <UserAnalysisRegister closeModal={() => setOpenUser(false)} />
        </ModalCustom>
      )}

      {openAdmin && (
        <ModalCustom
          title={currentAnalysis?.title}
          closeModal={() => setOpenAdmin(false)}
        >
          <AdminAnalysisRegister
            analysis={analyzesListAdapted.find(
              (el: AnalyzesObject) => el.id === currentAnalysis?.id
            )}
            closeModal={() => setOpenAdmin(false)}
          />
        </ModalCustom>
      )}
    </PageContainer>
  )
}
