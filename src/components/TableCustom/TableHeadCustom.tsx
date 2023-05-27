import {
  Box,
  Checkbox,
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel
} from '@mui/material'

type ITaleHead = {
  // order: string // 'asc' | 'desc'
  // orderBy: string
  // rowCount: number
  headLabel: any
  // numSelected: number
  // onRequestSort: (event: any, prop: any) => void
  // onSelectAllClick: (func: any) => void
}

export default function TableHeadCustom({
  // order,
  // orderBy,
  // rowCount,
  headLabel
}: // numSelected,
// onRequestSort,
// onSelectAllClick
ITaleHead) {
  // const createSortHandler = (property: any) => (event: any) => {
  //   onRequestSort(event, property)
  // }

  // const visuallyHidden = {
  //   border: 0,
  //   margin: -1,
  //   padding: 0,
  //   width: '1px',
  //   height: '1px',
  //   overflow: 'hidden',
  //   position: 'absolute',
  //   whiteSpace: 'nowrap',
  //   clip: 'rect(0 0 0 0)'
  // }

  return (
    <TableHead /* sx={{ background: '#cccc' }} */>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell> */}
        {headLabel.map((headCell: any) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
          >
            <TableSortLabel
              hideSortIcon
              // active={orderBy === headCell.id}
              // onClick={createSortHandler(headCell.id)}
            >
              <h2 className="font-bold">{headCell.label}</h2>
              {/* {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null} */}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
