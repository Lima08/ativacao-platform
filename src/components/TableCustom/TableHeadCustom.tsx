import { TableRow, TableCell, Typography } from '@mui/material'
type ITableHead = {
  headLabel: any
  isAdmin?: boolean
}

export default function TableHeadCustom({ headLabel, isAdmin }: ITableHead) {
  return (
    <TableRow>
      {headLabel.map((headCell: any) => {
        if (headCell.onlyAdmin && !isAdmin) return
        return (
          <TableCell key={headCell.id} align={headCell.align || 'left'}>
            <Typography
              variant="subtitle2"
              textAlign="center"
              alignItems="baseline"
              sx={{ fontWeight: 'bold' }}
            >
              {headCell.label}
            </Typography>
          </TableCell>
        )
      })}
    </TableRow>
  )
}
