'use client'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import GetAppIcon from '@mui/icons-material/GetApp'
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp'
import SmsIcon from '@mui/icons-material/Sms'
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Button,
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
  TextField
} from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { eAnalysisStatusType } from 'interfaces/entities/analysis/EAnalysisStatus'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import AdminAnalysisRegister from 'components/AdminAnalysisRegister'
import DeleteDoubleCheck from 'components/DeleteDoubleCheck'
import LoadingScreen from 'components/LoadingScreen'
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
    { id: 'status', label: 'Status', align: 'center' },
    { id: 'title', label: 'Título', align: 'center' },
    { id: 'updatedAt', label: 'Atualizado em', align: 'center' },
    { id: 'bi', label: 'Visualizar', align: 'center' },
    { id: 'message', label: 'Mensagem', align: 'center' },
    { id: 'actions', label: 'Ações', align: 'center' }
  ]

  const TABLE_HEAD_MOBILE = [
    { id: 'status', label: 'Status', align: 'center' },
    { id: 'bi', label: 'Visualizar', align: 'center' },
    { id: 'actions', label: 'Ações', align: 'center' }
  ]

  const { user } = useAuthStore((state) => state) as IAuthStore

  const [loading, page, rowsPerPage] = useGlobalStore((state) => [
    state.loading,
    state.page,
    state.rowsPerPage
  ])
  const [analyzesList, getAllAnalyzes, deleteAnalysis] = useMainStore(
    (state) => [state.analyzesList, state.getAllAnalyzes, state.deleteAnalysis]
  )

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [isSystemAdmin, setIsSystemAdmin] = useState(false)
  const [filteredAnalyzes, setFilteredAnalyzes] = useState<any[]>([])
  const [analyzesListAdapted, setAnalyzesListAdapted] = useState<any>([])
  const [showDeletePrompt, setShowDeletePrompt] = useState(false)
  const [itemToBeDeleted, setItemToBeDeleted] = useState<string>('')
  const [currentAnalysis, setCurrentAnalysis] = useState<{
    id: string
    title: string
  } | null>(null)
  const [openUser, setOpenUser] = useState(false)
  const [openMessage, setOpenMessage] = useState({
    isOpen: false,
    message: null
  })
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

  const startAnalyzesList = useCallback(() => {
    const analyzesAdapted =
      analyzesList &&
      analyzesList
        .map((analysis: any) => ({
          id: analysis.id,
          title: analysis.title,
          message: analysis.message,
          bucketUrl: analysis.bucketUrl,
          biUrl: analysis.biUrl,
          status: analysisStatusAdapter(analysis.status),
          updatedAt: analysis.createdAt
        }))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    setAnalyzesListAdapted(analyzesAdapted)
    analyzesAdapted && setFilteredAnalyzes(analyzesAdapted)
  }, [setAnalyzesListAdapted, analyzesList, page, rowsPerPage])

  const searchByTitle = (searchQuery: string) => {
    const filteredAnalyzes = analyzesListAdapted.filter((analysis: any) => {
      const analysisTitle = analysis.title.toLowerCase()
      const query = searchQuery.toLowerCase()
      return analysisTitle.includes(query)
    })
    setFilteredAnalyzes(filteredAnalyzes)
  }

  function deleteItem(decision: string) {
    if (decision === 'yes') {
      deleteAnalysis(itemToBeDeleted)
    }

    setShowDeletePrompt(!showDeletePrompt)
  }

  function showPrompt(id: string) {
    setShowDeletePrompt(true)
    setItemToBeDeleted(id)
    closeMenu()
  }

  useEffect(() => {
    if (analyzesList) return
    getAllAnalyzes()
  }, [getAllAnalyzes, analyzesList])

  useEffect(() => {
    startAnalyzesList()
  }, [startAnalyzesList])

  useEffect(() => {
    if (!user) return
    setIsSystemAdmin(user.role >= ROLES.SYSTEM_ADMIN)
  }, [user])

  return (
    <PageContainer
      pageTitle="Análises"
      pageSection="analyzes"
      customCallback={() => openCreateAnalysisModal()}
    >
      {loading && <LoadingScreen />}

      <Paper
        sx={{ width: '100%', border: `solid 1px ${theme.palette.divider}` }}
      >
        <SearchTableCustom onSearch={searchByTitle}>
          <Button
            href={process.env.NEXT_PUBLIC_EXAMPLE_ANALYSIS_ID!}
            variant="outlined"
            startIcon={<GetAppIcon />}
            download
          >
            {!isMobile && 'Baixar Planilha Exemplo'}
          </Button>
        </SearchTableCustom>

        <TableContainer sx={{ maxHeight: '56vh' }}>
          <Table>
            {!!filteredAnalyzes?.length && (
              <TableHead>
                {!isMobile && !!filteredAnalyzes.length && (
                  <TableHeadCustom headLabel={TABLE_HEAD} />
                )}
                {isMobile && !!filteredAnalyzes.length && (
                  <TableHeadCustom headLabel={TABLE_HEAD_MOBILE} />
                )}
              </TableHead>
            )}

            <TableBody>
              {filteredAnalyzes &&
                filteredAnalyzes.map((row: any) => {
                  const { id, title, message, biUrl, status, updatedAt } = row

                  return (
                    <TableRow
                      key={id}
                      sx={{ '$:hover': { cursor: 'pointer' } }}
                    >
                      <TableCell
                        size="small"
                        align="center"
                        component="th"
                        scope="row"
                      >
                        <Chip label={status.label} color={status.color} />
                      </TableCell>
                      {!isMobile && (
                        <>
                          <TableCell
                            size="small"
                            align="center"
                            sx={{
                              maxWidth: `${isMobile ? '100px' : '200px'}`
                            }}
                          >
                            <Tooltip title={title}>
                              <Typography
                                sx={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                                variant="subtitle2"
                              >
                                {title}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell size="small" align="center">
                            {formatDate(updatedAt)}
                          </TableCell>
                        </>
                      )}
                      <TableCell size="small" align="center">
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
                        <TableCell size="small" align="center">
                          {!!message?.length && (
                            <IconButton
                              aria-label="message"
                              size="large"
                              onClick={() =>
                                setOpenMessage({ isOpen: true, message })
                              }
                            >
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

                      <TableCell size="small" align="center">
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
              {!loading &&
                filteredAnalyzes &&
                filteredAnalyzes.length === 0 && (
                  <TableRow tabIndex={-1} role="checkbox" sx={{ px: 2 }}>
                    <TableCell size="small" align="center">
                      <Typography variant="subtitle2">
                        Nenhuma análise encontrada
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <PaginationTableCustom tableItems={analyzesList} />
      </Paper>

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
        {isSystemAdmin && (
          <MenuItem onClick={() => openAdminAnalysisModal()}>
            <IconButton aria-label="edit">
              <EditIcon />
            </IconButton>
            Analisar
          </MenuItem>
        )}
        <MenuItem
          sx={{ color: 'error.main' }}
          onClick={() => showPrompt(currentAnalysis?.id as string)}
        >
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
            isSystemAdmin
          />
        </ModalCustom>
      )}

      {openMessage.isOpen && (
        <ModalCustom
          title="Mensagem:"
          closeModal={() => setOpenMessage({ isOpen: false, message: null })}
          width={700}
          height={500}
        >
          <TextField
            id="message"
            value={openMessage?.message || ''}
            multiline
            rows={16}
            fullWidth
            disabled
            variant="outlined"
            sx={{ height: '100%' }}
          />
        </ModalCustom>
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
