'use client'
import { useCallback, useEffect, useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp'
import SmsIcon from '@mui/icons-material/Sms'
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff'
import {
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
  TextField
} from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { eProcessStatus } from 'interfaces/entities/process/EProcessStatus'
import { ITemplateProcessCreated } from 'interfaces/entities/templateProcess'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import AdminProcessRegister from 'components/AdminProcessRegister'
import DeleteDoubleCheck from 'components/DeleteDoubleCheck'
import LoadingScreen from 'components/LoadingScreen'
import ModalCustom from 'components/ModalCustom'
import PageContainer from 'components/PageContainer'
import ProcessListingSidebar from 'components/ProcessListingSidebar'
import RegisterProcessView from 'components/RegisterProcessView'
import PaginationTableCustom from 'components/TableCustom/PaginationTableCustom'
import SearchTableCustom from 'components/TableCustom/SearchTableCustom'
import TableHeadCustom from 'components/TableCustom/TableHeadCustom'
import UserProcessInitiator from 'components/UserProcessInitiator'

import { formatDate } from '../../../../utils'

enum eColorStatus {
  info = 'info',
  success = 'success',
  error = 'error',
  warning = 'warning'
}

type IProcessesStatusType = {
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

export default function ProcessView() {
  const TABLE_HEAD = [
    { id: 'status', label: 'Status', align: 'center' },
    { id: 'type', label: 'Tipo', align: 'center' },
    { id: 'title', label: 'Título', align: 'center' },
    { id: 'updatedAt', label: 'Atualizado em', align: 'center' },
    { id: 'message', label: 'Mensagem', align: 'center' },
    { id: 'actions', label: 'Ações', align: 'center' }
  ]

  const TABLE_HEAD_MOBILE = [
    { id: 'status', label: 'Status', align: 'center' },
    { id: 'title', label: 'Título', align: 'center' },
    { id: 'actions', label: 'Ações', align: 'center' }
  ]

  const { user } = useAuthStore((state) => state) as IAuthStore

  const [loading, page, rowsPerPage] = useGlobalStore((state) => [
    state.loading,
    state.page,
    state.rowsPerPage
  ])
  const [processesList, getAllProcesses, deleteProcess, templateProcessList] =
    useMainStore((state) => [
      state.processList,
      state.getAllProcesses,
      state.deleteProcess,
      state.templateProcessList,
      state.getAllTemplateProcesses
    ])

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [isSystemAdmin, setIsSystemAdmin] = useState(false)
  const [filteredProcesses, setFilteredProcesses] = useState<any[]>([])
  const [processesListAdapted, setProcessesListAdapted] = useState<any[]>([])
  const [currentProcess, setCurrentProcess] = useState<{
    id: string
    title: string
  } | null>(null)
  const [openMessage, setOpenMessage] = useState({
    isOpen: false,
    message: null
  })
  const [openAdmin, setOpenAdmin] = useState(false)
  const [openSystemAdmin, setOpenSystemAdmin] = useState(false)
  const [initiateProcess, setInitiateProcess] = useState(false)
  const [openOptions, setOpenOptions] = useState<any>(null)
  const [openProcessListing, setOpenProcessListing] = useState(false)
  const [currentTemplate, setCurrentTemplate] =
    useState<ITemplateProcessCreated>()
  const [showDeletePrompt, setShowDeletePrompt] = useState<boolean>(false)

  const processStatusAdapter = (
    status: eProcessStatus
  ): IProcessesStatusType => {
    const statusMappers: Record<
      eProcessStatus,
      { color: eColorStatus; label: string }
    > = {
      open: { color: eColorStatus.info, label: 'Aberto' },
      pending: { color: eColorStatus.warning, label: 'Em andamento' },
      rejected: { color: eColorStatus.error, label: 'Aguardando correção' },
      done: { color: eColorStatus.success, label: 'Finalizado' }
    }

    return statusMappers[status]
  }

  const openProcessesListingSidebar = async () => {
    setOpenProcessListing(true)
  }

  const openSystemAdminProcessAnalysisModal = async () => {
    setOpenAdmin(true)
    setOpenOptions(null)
  }

  const openMenu = (event: any, process: { id: string; title: string }) => {
    setOpenOptions(event.currentTarget)
    setCurrentProcess(process)
  }

  const closeMenu = () => {
    setOpenOptions(null)
    setCurrentProcess(null)
  }

  function deleteItem() {
    if (currentProcess) {
      deleteProcess(currentProcess.id)

      closeMenu()
      setShowDeletePrompt(false)
    }
  }

  const startProcessesList = useCallback(() => {
    const processAdapted = processesList
      ? processesList
          .map((process: any) => {
            const templateName = templateProcessList?.length
              ? templateProcessList.find(
                  (template) => template.id === process.templateProcessId
                )?.title
              : 'Template não encontrado'
            const processAdapted = {
              id: process.id,
              title: process.title,
              templateTitle: templateName,
              updatedAt: process.createdAt,
              message: process.message,
              bucketUrl: process.bucketUrl,
              documents: process.documents,
              status: processStatusAdapter(process.status)
            }
            return processAdapted
          })
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : []

    setProcessesListAdapted(processAdapted)
    processAdapted && setFilteredProcesses(processAdapted)
  }, [
    setProcessesListAdapted,
    processesList,
    templateProcessList,
    page,
    rowsPerPage
  ])

  const searchByTitle = (searchQuery: string) => {
    const filteredProcesses = processesListAdapted.filter((analysis: any) => {
      const analysisTitle = analysis.title.toLowerCase()
      const query = searchQuery.toLowerCase()
      return analysisTitle.includes(query)
    })
    setFilteredProcesses(filteredProcesses)
  }

  useEffect(() => {
    if (processesList) return
    getAllProcesses()
  }, [getAllProcesses, processesList])

  useEffect(() => {
    startProcessesList()
  }, [startProcessesList])

  useEffect(() => {
    if (!user) return
    setIsSystemAdmin(user.role >= ROLES.SYSTEM_ADMIN)
  }, [user])

  if ((user?.role as number) < ROLES.COMPANY_ADMIN) {
    return (
      <div className="m-4" suppressHydrationWarning={true}>
        Você não tem permissão para ver esta página.
      </div>
    )
  }

  return (
    <PageContainer
      pageTitle="Processos"
      pageSection="processes"
      customCallback={() => openProcessesListingSidebar()}
      secondaryAction={{
        label: 'Novo',
        callback: () => openProcessesListingSidebar()
      }}
      isProcesses
    >
      {loading && <LoadingScreen />}

      <Paper>
        <SearchTableCustom onSearch={searchByTitle} />

        <TableContainer sx={{ maxHeight: '56vh' }}>
          <Table stickyHeader>
            {!!filteredProcesses?.length && (
              <TableHead>
                {!isMobile && <TableHeadCustom headLabel={TABLE_HEAD} />}
                {isMobile && <TableHeadCustom headLabel={TABLE_HEAD_MOBILE} />}
              </TableHead>
            )}

            <TableBody>
              {filteredProcesses &&
                filteredProcesses.map((row: any) => {
                  const {
                    id,
                    title,
                    templateTitle,
                    updatedAt,
                    message,
                    status
                  } = row

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
                        sx={{
                          maxWidth: '120px'
                        }}
                      >
                        <Chip label={status.label} color={status.color} />
                      </TableCell>
                      {!isMobile && (
                        <>
                          <TableCell
                            size="small"
                            align="center"
                            component="th"
                            sx={{
                              maxWidth: `${isMobile ? '100px' : '200px'}`
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width: '100%'
                              }}
                            >
                              {templateTitle}
                            </Typography>
                          </TableCell>
                          <TableCell
                            size="small"
                            align="center"
                            component="th"
                            sx={{
                              maxWidth: `${isMobile ? '100px' : '200px'}`
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width: '100%'
                              }}
                            >
                              {title}
                            </Typography>
                          </TableCell>
                          <TableCell size="small" align="center" component="th">
                            {formatDate(updatedAt)}
                          </TableCell>
                        </>
                      )}
                      {isMobile && (
                        <TableCell size="small" align="center" component="th">
                          <div className="truncate">
                            <p>{title}</p>
                          </div>
                        </TableCell>
                      )}
                      {!isMobile && (
                        <TableCell size="small" align="center" component="th">
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

                      <TableCell size="small" align="center" component="th">
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
                filteredProcesses &&
                filteredProcesses.length === 0 && (
                  <TableRow sx={{ px: 2 }}>
                    <TableCell size="small" align="center" component="th">
                      <Typography variant="subtitle2">
                        Nenhum processo encontrado
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <PaginationTableCustom tableItems={processesList} />
      </Paper>

      <Popover
        open={Boolean(openOptions)}
        anchorEl={openOptions}
        onClose={() => closeMenu()}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
          <MenuItem onClick={() => openSystemAdminProcessAnalysisModal()}>
            <IconButton aria-label="edit">
              <EditIcon />
            </IconButton>
            Analisar
          </MenuItem>
        )}
        <MenuItem
          sx={{ color: 'error.main' }}
          onClick={() => setShowDeletePrompt(true)}
        >
          <IconButton aria-label="delete" sx={{ color: 'error.main' }}>
            <DeleteIcon />
          </IconButton>
          Deletar
        </MenuItem>
      </Popover>

      {openAdmin && (
        <ModalCustom
          title={currentProcess?.title}
          closeModal={() => setOpenAdmin(false)}
        >
          <AdminProcessRegister
            process={processesListAdapted.find(
              (el: AnalyzesObject) => el.id === currentProcess?.id
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

      <ProcessListingSidebar
        handleDrawer={setOpenProcessListing}
        isOpen={openProcessListing}
        openRegister={setOpenSystemAdmin}
        openInitiator={setInitiateProcess}
        customCb={setCurrentTemplate}
      />

      {openSystemAdmin && (
        <ModalCustom width={400} closeModal={() => setOpenSystemAdmin(false)}>
          <RegisterProcessView closeModal={() => setOpenSystemAdmin(false)} />
        </ModalCustom>
      )}
      {initiateProcess && currentTemplate && (
        <ModalCustom
          width={400}
          customPadding={1}
          closeModal={() => setInitiateProcess(false)}
        >
          <UserProcessInitiator
            closeModal={() => setInitiateProcess(false)}
            buttonText="Abrir processo"
            templateProcess={currentTemplate}
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
