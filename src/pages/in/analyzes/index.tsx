'use client'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Card,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material'
import { IAnalysisCreated } from 'interfaces/entities/analysis'
import { eAnalysisStatusType } from 'interfaces/entities/analysis/EAnalysisStatus'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'
import DashboardLayout from 'wrappers/DashboardLayout'

import AdminAnalysisRegister from 'components/AdminAnalysisRegister'
import CustomModal from 'components/CustomModal'
import PageContainer from 'components/PageContainer'
import SearchPrevNext from 'components/SearchPrevNext'
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
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'title', label: 'Título', alignRight: false },
    { id: 'updatedAt', label: 'Atualizado em', alignRight: false },
    { id: 'bi', label: 'Ver análise', alignRight: false },
    { id: 'actions', label: 'Ações', alignRight: true }
  ]

  const [loading] = useGlobalStore((state) => [state.loading])

  const [analyzesList, getAllAnalyzes, deleteAnalysis] = useMainStore(
    (state) => [state.analyzesList, state.getAllAnalyzes, state.deleteAnalysis]
  )

  const [analyzesListAdapted, setAnalyzesListAdapted] = useState<any>([])
  const [analysisId, setAnalysisId] = useState('')
  const [openUser, setOpenUser] = useState(false)
  const [openAdmin, setOpenAdmin] = useState(false)

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

  const handleEdit = async (id: string) => {
    setOpenAdmin(true)
    // router.push(`/in/users/${id}`)
  }

  function deleteItem(id: string) {
    const userDecision = confirm('Confirmar deleção?')

    if (userDecision) {
      deleteAnalysis(id)
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

      return result
    }

    const listAdapted = analyzesAdapter(analyzesList)
    setAnalyzesListAdapted(listAdapted)
  }, [setAnalyzesListAdapted, analyzesList])

  useEffect(() => {
    getAllAnalyzes()
  }, [getAllAnalyzes])

  useEffect(() => {
    startAnalyzesList()
  }, [startAnalyzesList])

  return (
    <DashboardLayout>
      <PageContainer
        pageTitle="Análises"
        pageSection="analyzes"
        customCallback={() => setOpenUser(true)}
      >
        <SearchPrevNext />
        {/* {loading && <p>Carregando...</p>} */}
        <ul className="list-none mt-8 w-12/12">
          {!loading && !analyzesList.length && (
            <li className="flex items-center justify-center mt-5 bg-white h-12 w-full border rounded">
              Nenhuma analise encontrada
            </li>
          )}
          {/* {!!analyzesListAdapted?.length &&
            analyzesListAdapted.map((analysis: AnalyzesObject) => (
              <li
                key={analysis.id}
                className="flex md:gap-10 hover:bg-slate-100 bg-white w-full border rounded max-h-18"
              >
                <ListAnalyzesItem
                  data={analysis}
                  onDelete={deleteItem}
                  editAnalysis={openAdmin}
                  setEditAnalysis={setOpenAdmin}
                  setAnalysisId={setAnalysisId}
                />
              </li>
            ))} */}

          <Card>
            {/* // TODO: Pensar em mobile */}
            <TableContainer sx={{ minWidth: 600 }}>
              <Table>
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {analyzesListAdapted &&
                    analyzesListAdapted.map((row: any) => {
                      const {
                        id,
                        title,
                        message,
                        bucketUrl,
                        biUrl,
                        status,
                        updatedAt
                      } = row

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

                          <TableCell align="right">
                            <IconButton
                              aria-label="edit"
                              size="large"
                              onClick={() => handleEdit(id)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              size="large"
                              onClick={() => deleteItem(id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                          {/* ver detalhes - deletar - editar? -  */}
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* --------------------------------------------------- */}
          {openUser && (
            <CustomModal
              size="w-[400px] h-[400px]"
              open={openUser}
              setOpen={setOpenUser}
            >
              {openUser && <UserAnalysisRegister setClose={setOpenUser} />}
            </CustomModal>
          )}
          {openAdmin && (
            <CustomModal
              size="w-[400px] h-[400px]"
              open={openAdmin}
              setOpen={setOpenAdmin}
            >
              {openAdmin && (
                <AdminAnalysisRegister
                  analysis={analyzesListAdapted.find(
                    (el: AnalyzesObject) => el.id === analysisId
                  )}
                  setClose={setOpenAdmin}
                />
              )}
            </CustomModal>
          )}
        </ul>
      </PageContainer>
    </DashboardLayout>
  )
}
