import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import HistoryIcon from '@mui/icons-material/History'
import {
  Avatar,
  Paper,
  Chip,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Stack
} from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import LoadingScreen from 'components/LoadingScreen'
import PageContainer from 'components/PageContainer'
import PaginationTableCustom from 'components/TableCustom/PaginationTableCustom'
import SearchTableCustom from 'components/TableCustom/SearchTableCustom'
import TableHeadCustom from 'components/TableCustom/TableHeadCustom'

import { formatDate } from '../../../../utils'

export default function UsersList() {
  const TABLE_HEAD = [
    { id: 'avatar', label: 'Foto perfil', align: 'center' },
    { id: 'name', label: 'Nome', align: 'center' },
    { id: 'role', label: 'Cargo', align: 'center' },
    { id: 'status', label: 'Status', align: 'center' },
    { id: 'createdAt', label: 'Data criação', align: 'center' },
    { id: 'actions', label: 'Ações', align: 'center', onlyAdmin: true }
  ]

  const TABLE_HEAD_MOBILE = [
    { id: 'avatar', label: 'Avatar', align: 'center' },
    { id: 'name', label: 'Name', align: 'center' },
    { id: 'actions', label: 'Ações', align: 'center', onlyAdmin: true }
  ]

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const router = useRouter()

  const [loading, error, setError, setToaster, page, rowsPerPage] =
    useGlobalStore((state) => [
      state.loading,
      state.error,
      state.setError,
      state.setToaster,
      state.page,
      state.rowsPerPage
    ])
  const { user } = useAuthStore((state) => state) as IAuthStore

  const [usersList, getAllUsers] = useMainStore((state) => [
    state.usersList,
    state.getAllUsers
  ])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  const handleEdit = async (id: string) => {
    router.push(`/in/users/${id}`)
  }

  const searchByName = (searchQuery: string) => {
    const filteredUsers =
      usersList &&
      usersList.filter((user) => {
        const userName = user.name.toLowerCase()
        const query = searchQuery.toLowerCase()
        return userName.includes(query)
      })
    filteredUsers &&
      setFilteredUsers(
        filteredUsers.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )
      )
  }

  function goToHistory(userId: string) {
    router.push(`/in/users/${userId}/history`)
  }

  useEffect(() => {
    if (!usersList) return

    console.log(
      '🚀 ~ file: index.tsx:105 ~ usersList:',
      usersList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    )
    setFilteredUsers(
      usersList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    )
  }, [setFilteredUsers, usersList, page, rowsPerPage])

  useEffect(() => {
    if (usersList) return
    getAllUsers()
  }, [getAllUsers, usersList])

  useEffect(() => {
    if (!error) return
    console.error(error)
    setToaster({
      isOpen: true,
      message: error.message,
      type: 'error'
    })

    setError(null)
  }, [error, setToaster, setError])

  useEffect(() => {
    if (!user || !user.role) return
    if (user.role >= ROLES.COMPANY_ADMIN) {
      setIsAdmin(true)
    }
  }, [user])

  return (
    <PageContainer pageTitle="Lista de usuários">
      {loading && <LoadingScreen />}

      <Paper>
        <SearchTableCustom onSearch={searchByName} />
        <TableContainer sx={{ maxHeight: '56vh' }}>
          <Table stickyHeader>
            {!!filteredUsers?.length && (
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
              {filteredUsers &&
                filteredUsers.map((row: any) => {
                  const { id, name, role, isActive, imageUrl, createdAt } = row

                  return (
                    <TableRow hover key={id} onClick={() => handleEdit(id)}>
                      <TableCell component="th" scope="row" align="center">
                        <Stack alignItems="center" justifyContent="center">
                          <Avatar alt={name} src={imageUrl} />
                        </Stack>
                      </TableCell>
                      <TableCell
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
                              textOverflow: 'ellipsis',
                              width: '100%'
                            }}
                            variant="subtitle2"
                            textAlign="center"
                          >
                            {name}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      {!isMobile && (
                        <TableCell size="small" scope="row" align="center">
                          {role > 100 ? 'Administrador' : 'Usuário'}
                        </TableCell>
                      )}

                      {!isMobile && (
                        <>
                          <TableCell size="small" scope="row" align="center">
                            <Chip
                              label={isActive ? 'ativo' : 'inativo'}
                              color={isActive ? 'success' : 'error'}
                              sx={{ width: 80 }}
                            />
                          </TableCell>

                          <TableCell size="small" scope="row" align="center">
                            {formatDate(createdAt)}
                          </TableCell>
                        </>
                      )}

                      {isAdmin && (
                        <TableCell
                          scope="row"
                          align="center"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <Tooltip title="Histórico de acesso" placement="top">
                            <IconButton
                              aria-label="edit"
                              size="large"
                              onClick={() => goToHistory(id)}
                            >
                              <HistoryIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <PaginationTableCustom tableItems={usersList} />
      </Paper>
    </PageContainer>
  )
}
