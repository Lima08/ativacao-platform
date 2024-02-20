import React, { useEffect, useState } from 'react'

import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { IconButton, Box, List, ListItem } from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { IDocumentCreated } from 'interfaces/entities/document'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'

type DocumentProps = {
  documentsList: IDocumentCreated[]
  onDelete: (id: string) => void
}

export default function FileList({ documentsList, onDelete }: DocumentProps) {
  const { user } = useAuthStore((state) => state) as IAuthStore
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!user || !user.role) return
    if (user.role >= ROLES.COMPANY_ADMIN) {
      setIsAdmin(true)
    }
  }, [user])

  return (
    <List>
      {documentsList.map(({ url, id }) => (
        <ListItem
          key={id}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <a href={url} download target='_target'>
            {url}
          </a>
          {isAdmin && (
            <IconButton size="small" onClick={() => onDelete(id)}>
              <HighlightOffIcon className="hover:bg-red-500 hover:text-white rounded-full " />
            </IconButton>
          )}
        </ListItem>
      ))}
    </List>
  )
}
