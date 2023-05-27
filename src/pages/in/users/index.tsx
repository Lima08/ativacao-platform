import { useRouter } from 'next/router'
import { useEffect } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
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
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'role', label: 'Cargo', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'createdAt', label: 'Data criação', alignRight: false },
    { id: 'actions', label: 'Ações', alignRight: true }
  ]

  const router = useRouter()

  const [loading, error, setToaster] = useGlobalStore((state) => [
    state.loading,
    state.error,
    state.setToaster
  ])
  const [usersList, getAllUsers] = useMainStore((state) => [
    state.usersList,
    state.getAllUsers
  ])

  useEffect(() => {
    console.log('🚀 ~ file: index.tsx:46 ~ UsersList ~ usersList:', usersList)
  }, [usersList])

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
  }, [error, setToaster])

  // useEffect(() => {
  //   if (!usersList) return

  //   const usersAdapted = usersAdapter(usersList)
  //   setUsersListAdapted(usersAdapted)
  // }, [usersList])

  return (
    <DashboardLayout>
      {/* sx={{ borderRight: '1px solid #ccc' }}> */}
      <PageContainer pageTitle="Lista de usuários" pageSection="users">
        {loading && <div>Carregando...</div>}
        <Card>
          {/* <itensToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

          {/* <scrollbars> */}
          {/* // TODO: Pensar em mobile */}
          <TableContainer sx={{ minWidth: 600 }}>
            <Table>
              <TableHeadCustom
                // order={order}
                // orderBy={orderBy}
                headLabel={TABLE_HEAD}
                // rowCount={tableData.length}
                // numSelected={selected.length}
                // onRequestSort={handleRequestSort}
                // onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {usersList &&
                  usersList.map((row: any) => {
                    const { id, name, role, status, imageUrl, createdAt } = row

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox">
                        {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUser}
                      onChange={(event) => handleClick(event, name)}
                    />
                  </TableCell> */}

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
                          {status && <Chip label="ativo" color="success" />}
                          {!status && <Chip label="inativo" color="error" />}
                        </TableCell>

                        <TableCell align="left">
                          {formatDate(createdAt)}
                        </TableCell>
                        {/* TODO: Ajustar esse btn */}

                        <TableCell align="right">
                          <IconButton aria-label="edit" size="large">
                            <EditIcon />
                          </IconButton>
                          <IconButton aria-label="delete" size="large">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                {/* {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )} */}
              </TableBody>

              {/* {isNotFound && (
            <TableBody>
              <TableRow>
                <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                  <Paper
                    sx={{
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="h6" paragraph>
                      Not found
                    </Typography>

                    <Typography variant="body2">
                      No results found for &nbsp;
                      <strong>&quot;{filterName}&quot;</strong>.
                      <br /> Try checking for typos or using complete words.
                    </Typography>
                  </Paper>
                </TableCell>
              </TableRow>
            </TableBody>
          )} */}
            </Table>
          </TableContainer>
          {/* </scrollbars> */}
        </Card>
      </PageContainer>
    </DashboardLayout>
  )
}
