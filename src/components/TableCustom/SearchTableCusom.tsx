import SearchIcon from '@mui/icons-material/Search'
import { Box, TextField } from '@mui/material'

interface SearchProps {
  onSearch: (query: string) => void
}

const DELAY_DEBOUNCE = 300

export default function SearchTableCustom({ onSearch }: SearchProps) {
  let delayDebounceFn: NodeJS.Timeout

  function searchDebounce(searchQuery: string) {
    if (delayDebounceFn) clearTimeout(delayDebounceFn)
    delayDebounceFn = setTimeout(() => {
      onSearch(searchQuery)
    }, DELAY_DEBOUNCE)
  }

  return (
    <Box display="flex" alignItems="baseline" p={1}>
      <div className="mx-1">
        <SearchIcon />
      </div>
      <TextField
        label="Digite sua busca..."
        onChange={(e) => searchDebounce(e.target.value)}
        variant="outlined"
        margin="normal"
        fullWidth
      />
    </Box>
  )
}
