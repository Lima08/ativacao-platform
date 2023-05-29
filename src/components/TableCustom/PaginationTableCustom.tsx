'use client'
import { useEffect } from 'react'

import { TablePagination } from '@mui/material'
import useGlobalStore from 'store/useGlobalStore'

export default function PaginationTableCustom({ tableItems }: any) {
  const [page, rowsPerPage, setPage, setRowsPerPage] = useGlobalStore(
    (state) => [
      state.page,
      state.rowsPerPage,
      state.setPage,
      state.setRowsPerPage
    ]
  )
  const handleChangePage = (event_: any, newPage: any) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: any) => {
    setPage(0)
    setRowsPerPage(parseInt(event.target.value, 10))
  }

  useEffect(() => {
    setPage(0)
    setRowsPerPage(5)
  }, [setPage, setRowsPerPage])

  return (
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={tableItems.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      labelRowsPerPage="Máximo"
    />
  )
}
