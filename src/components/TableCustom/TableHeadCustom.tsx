import { TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material'

type ITableHead = {
  headLabel: any
}

export default function TableHeadCustom({ headLabel }: ITableHead) {
  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell: any) => (
          <TableCell key={headCell.id} align={headCell.align || 'left'}>
            <TableSortLabel hideSortIcon>
              <h2 className="font-bold">{headCell.label}</h2>
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
