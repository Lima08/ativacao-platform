import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import EditIcon from '@mui/icons-material/Edit'
import {
  Avatar,
  Card,
  Chip,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import PageContainer from 'components/PageContainer'
import PaginationTableCustom from 'components/TableCustom/PaginationTableCustom'
import SearchTableCustom from 'components/TableCustom/SearchTableCustom'
import TableHeadCustom from 'components/TableCustom/TableHeadCustom'

import { formatDate } from '../../../../utils'

export default function UsersList() {
  const TABLE_HEAD = [
    { id: 'name', label: 'Name', alignRight: 'left' },
    { id: 'role', label: 'Cargo', alignRight: 'left' },
    { id: 'status', label: 'Status', alignRight: 'left' },
    { id: 'createdAt', label: 'Data criação', alignRight: 'left' },
    { id: 'actions', label: 'Ações', alignRight: 'right' }
  ]

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
  const [usersList, getAllUsers] = useMainStore((state) => [
    state.usersList,
    state.getAllUsers
  ])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])

  const handleEdit = async (id: string) => {
    router.push(`/in/users/${id}`)
  }

  const searchByName = (searchQuery: string) => {
    const filteredUsers = usersList.filter((user) => {
      const userName = user.name.toLowerCase()
      const query = searchQuery.toLowerCase()
      return userName.includes(query)
    })
    setFilteredUsers(
      filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    )
  }

  useEffect(() => {
    if (!usersList) return

    setFilteredUsers(
      usersList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    )
  }, [setFilteredUsers, usersList, page, rowsPerPage])

  useEffect(() => {
    getAllUsers()
  }, [getAllUsers])

  useEffect(() => {
    if (!error) return
    setToaster({
      isOpen: true,
      message: 'Um erro inesperado ocorreu.',
      type: 'error',
      duration: 5000
    })

    setError(null)
  }, [error, setToaster, setError])

  return (
    <PageContainer pageTitle="Lista de usuários">
      {loading && <div>Carregando...</div>}
      <Card>
        {/* // TODO: Pensar em mobile */}
        <TableContainer sx={{ maxHeight: '68vh' }}>
          <SearchTableCustom onSearch={searchByName} />

          <Table>
            <TableHeadCustom headLabel={TABLE_HEAD} />
            <TableBody>
              {filteredUsers &&
                filteredUsers.map((row: any) => {
                  const { id, name, role, isActive, imageUrl, createdAt } = row

                  return (
                    <TableRow hover key={id} tabIndex={-1} role="checkbox">
                      <TableCell
                        component="th"
                        scope="row"
                        padding="none"
                        sx={{ px: 1 }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar alt={name} src={imageUrl} />
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell align="left">
                        {role > 100 ? 'Administrador' : 'Usuário'}
                      </TableCell>

                      <TableCell align="left">
                        <Chip
                          label={isActive ? 'ativo' : 'inativo'}
                          color={isActive ? 'success' : 'error'}
                          sx={{ width: 80 }}
                        />
                      </TableCell>

                      <TableCell align="left">
                        {formatDate(createdAt)}
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          aria-label="edit"
                          size="large"
                          onClick={() => handleEdit(id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <PaginationTableCustom tableItems={usersList} />
      </Card>
    </PageContainer>
  )
}
