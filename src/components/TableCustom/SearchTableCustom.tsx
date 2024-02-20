import { useRouter } from 'next/router'

import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, TextField, IconButton, Divider } from '@mui/material'

interface SearchProps {
  onSearch: (query: string) => void
  className?: string
  showBackButton?: boolean
  customWidth?: string
  children?: React.ReactNode
}

const DELAY_DEBOUNCE = 300

export default function SearchTableCustom({
  onSearch,
  className,
  showBackButton,
  customWidth,
  children
}: SearchProps) {
  let delayDebounceFn: NodeJS.Timeout

  const router = useRouter()

  // TODO: Passar para helpers
  function searchDebounce(searchQuery: string) {
    if (delayDebounceFn) clearTimeout(delayDebounceFn)
    delayDebounceFn = setTimeout(() => {
      onSearch(searchQuery)
    }, DELAY_DEBOUNCE)
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        className={className}
        sx={{ padding: '1rem', width: customWidth }}
      >
        <IconButton aria-label="menu" sx={{ pl: 0 }}>
          <SearchIcon />
        </IconButton>
        <TextField
          label="Digite sua busca..."
          onChange={(e) => searchDebounce(e.target.value)}
          variant="outlined"
          sx={{ margin: 'auto 0' }}
          fullWidth
        />
        {showBackButton && (
          <Button variant="outlined" onClick={() => router.back()}>
            Voltar
          </Button>
        )}
        {children}
      </Box>
      <Divider sx={{ backgroundColor: 'primary.main', my: 2 }} />
    </>
  )
}
