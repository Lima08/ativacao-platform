import { useRouter } from 'next/router'
import { useEffect } from 'react'

import EditIcon from '@mui/icons-material/Edit'
import {
  Avatar,
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
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'
import DashboardLayout from 'wrappers/DashboardLayout'

import PageContainer from 'components/PageContainer'
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

  const [loading, error, setError, setToaster] = useGlobalStore((state) => [
    state.loading,
    state.error,
    state.setError,
    state.setToaster
  ])
  const [usersList, getAllUsers] = useMainStore((state) => [
    state.usersList,
    state.getAllUsers
  ])

  const handleEdit = async (id: string) => {
    router.push(`/in/users/${id}`)
  }

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
    <DashboardLayout>
      <PageContainer pageTitle="Lista de usuários" pageSection="users">
        {loading && <div>Carregando...</div>}
        <Card>
          {/* // TODO: Pensar em mobile */}
          <TableContainer sx={{ minWidth: 600 }}>
            <Table>
              <TableHeadCustom headLabel={TABLE_HEAD} />
              <TableBody>
                {usersList &&
                  usersList.map((row: any) => {
                    const { id, name, role, isActive, imageUrl, createdAt } =
                      row

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox">
                        <TableCell
                          component="th"
                          scope="row"
                          padding="none"
                          sx={{ px: 1 }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
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
        </Card>
      </PageContainer>
    </DashboardLayout>
  )
}
