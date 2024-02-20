import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import CampaignIcon from '@mui/icons-material/Campaign'
import HistoryIcon from '@mui/icons-material/History'
import {
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { saveAs } from 'file-saver'
import { ILogCreated } from 'interfaces/entities/log'
import { useAuthStore } from 'store/useAuthStore'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'
import * as XLSX from 'xlsx'

import LoadingScreen from 'components/LoadingScreen'
import PageContainer from 'components/PageContainer'
import PercentageBadge from 'components/PercentageBadge'
import PaginationTableCustom from 'components/TableCustom/PaginationTableCustom'
import SearchTableCustom from 'components/TableCustom/SearchTableCustom'
import TableHeadCustom from 'components/TableCustom/TableHeadCustom'

import { formatDate } from '../../../../../utils'

export default function UserLogList() {
  const TABLE_HEAD = [
    { id: 'module', label: 'Módulo', align: 'center' },
    { id: 'info', label: 'Título', align: 'center' },
    { id: 'media', label: 'Total de mídias', align: 'center' },
    { id: 'watched', label: '% Visualizado', align: 'center' },
    { id: 'updatedAt', label: 'Ultimo acesso', align: 'center' }
  ]

  const TABLE_HEAD_MOBILE = [
    { id: 'info', label: 'Título', align: 'center' },
    { id: 'watched', label: '% Visualizado', align: 'center' },
    { id: 'updatedAt', label: 'Ultimo acesso', align: 'center' }
  ]

  const router = useRouter()

  let userId = ''
  if (router.isReady) {
    userId = String(router.query.id)
  }

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [user, setUser] = useAuthStore((state: any) => [
    state.user,
    state.setUser
  ])

  const [loading, page, rowsPerPage] = useGlobalStore((state) => [
    state.loading,
    state.page,
    state.rowsPerPage
  ])
  const [logsList, getAllLogs, getUserById, currentUser] = useMainStore(
    (state) => [
      state.logsList,
      state.getAllLogs,
      state.getUserById,
      state.currentUser
    ]
  )
  const [filteredUserLogList, setFilteredUserLogList] = useState<ILogCreated[]>(
    []
  )
  const [loggedUser, setLoggedUser] = useState<any>(null)

  const searchByName = (searchQuery: string) => {
    const filteredUserLogList =
      logsList &&
      logsList.filter((log: ILogCreated) => {
        const logInfo = log.info && log.info.toLowerCase()
        const query = searchQuery.toLowerCase()
        return logInfo?.includes(query)
      })
    filteredUserLogList &&
      setFilteredUserLogList(
        filteredUserLogList.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )
      )
  }

  function percentage(watched: number, total: number) {
    return ((watched * 100) / total).toFixed(2)
  }

  const handleDownloadExcel = () => {
    const logsToWorksheet: any = logsList?.map(
      ({
        trainingId,
        campaignId,
        module,
        info,
        totalMedias,
        mediasWatched,
        createdAt
      }) => {
        return {
          Título: info,
          Módulo: module,
          'Id no banco': trainingId || campaignId,
          'Total de mídias': totalMedias,
          'Mídias visualizadas': mediasWatched || 'Não se aplica',
          '% visualizado':
            mediasWatched && totalMedias
              ? percentage(mediasWatched, totalMedias)
              : 'Não se aplica',
          'Data do acesso': formatDate(String(createdAt)),
          'Horário do acesso': formatDate(String(createdAt), "HH':'mm':'ss ")
        }
      }
    )

    const workbook = XLSX.utils.book_new()
    const workSheetName = currentUser ? currentUser.name : 'Logs'
    const worksheet = XLSX.utils.json_to_sheet(logsToWorksheet)

    XLSX.utils.book_append_sheet(workbook, worksheet, workSheetName)
    const excelBuffer = XLSX.write(workbook, {
      type: 'array',
      bookType: 'xlsx'
    })

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    saveAs(blob, `${workSheetName.replace(/\s+/g, '-')}.xlsx`)
  }

  useEffect(() => {
    if (!logsList) return

    setFilteredUserLogList(
      logsList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    )
  }, [setFilteredUserLogList, logsList, page, rowsPerPage])

  useEffect(() => {
    if (!userId) return
    getAllLogs(userId)
    getUserById(userId)
  }, [userId, getAllLogs, getUserById])

  useEffect(() => {
    if (!user) return
    setLoggedUser(user)
  }, [user])

  if (loggedUser?.role < (currentUser?.role as number)) {
    return (
      <div className="m-4">Você não tem permissão para ver esta página.</div>
    )
  }

  return (
    <PageContainer
      pageTitle="Histórico de acesso"
      secondaryAction={{
        label: 'Baixar planilha',
        callback: handleDownloadExcel
      }}
    >
      {loading && <LoadingScreen />}

      <Card>
        <SearchTableCustom onSearch={searchByName} showBackButton />
        <TableContainer sx={{ maxHeight: '66vh' }}>
          <Table>
            {!isMobile && <TableHeadCustom headLabel={TABLE_HEAD} />}
            {isMobile && <TableHeadCustom headLabel={TABLE_HEAD_MOBILE} />}

            <TableBody>
              {filteredUserLogList &&
                filteredUserLogList.map((row: ILogCreated) => {
                  const {
                    id,
                    module,
                    info,
                    totalMedias,
                    mediasWatched,
                    updatedAt
                  } = row

                  return (
                    <TableRow
                      hover
                      key={id}
                      tabIndex={-1}
                      role="checkbox"
                      sx={{ px: 2, alignItems: 'center' }}
                    >
                      {!isMobile && (
                        <TableCell
                          component="th"
                          scope="row"
                          padding="none"
                          align="center"
                          sx={{ px: 2 }}
                        >
                          {module === 'campaign' && (
                            <Tooltip title="Campanhas">
                              <CampaignIcon />
                            </Tooltip>
                          )}
                          {module === 'training' && (
                            <Tooltip title="Treinamentos">
                              <AppRegistrationIcon />
                            </Tooltip>
                          )}
                          {module &&
                            !['training', 'campaign'].includes(module) && (
                              <Tooltip title="Outros">
                                <HistoryIcon />
                              </Tooltip>
                            )}
                          {!module && (
                            <Tooltip title="Outros">
                              <HistoryIcon />
                            </Tooltip>
                          )}
                        </TableCell>
                      )}
                      <TableCell
                        component="th"
                        scope="row"
                        padding="none"
                        align="center"
                        sx={{ px: 2 }}
                      >
                        <Typography
                          variant="subtitle2"
                          textAlign="center"
                          alignItems="baseline"
                        >
                          {info}
                        </Typography>
                      </TableCell>

                      {!isMobile && (
                        <TableCell size="small" align="center">
                          <Typography
                            variant="subtitle2"
                            textAlign="center"
                            alignItems="baseline"
                          >
                            {totalMedias || 'Sem mídias disponíveis'}
                          </Typography>
                        </TableCell>
                      )}

                      <Tooltip
                        title={`Mídias visualizadas: ${
                          mediasWatched || 'Sem mídias disponíveis'
                        }`}
                      >
                        <TableCell size="small" align="center">
                          {mediasWatched && mediasWatched ? (
                            <PercentageBadge
                              value={Number(
                                percentage(mediasWatched || 0, totalMedias || 0)
                              )}
                            />
                          ) : (
                            'Não se aplica'
                          )}
                        </TableCell>
                      </Tooltip>

                      <TableCell size="small" align="center">
                        {formatDate(String(updatedAt), 'HH:mm - dd/MM/yyyy')}
                      </TableCell>
                    </TableRow>
                  )
                })}
              {!loading &&
                filteredUserLogList &&
                filteredUserLogList.length === 0 && (
                  <TableRow tabIndex={-1} role="checkbox" sx={{ px: 2 }}>
                    <TableCell size="small" align="center">
                      <Typography variant="subtitle2">
                        Nenhum log encontrado
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />
        <PaginationTableCustom tableItems={filteredUserLogList} />
      </Card>
    </PageContainer>
  )
}
