import Image from 'next/image'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import DownloadIcon from '@mui/icons-material/Download'
import {
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
  Box,
  Fab
} from '@mui/material'
import useIsSuperAdmin from 'hooks/useIsSuperAdmin'
import { ITemplateProcessCreated } from 'interfaces/entities/templateProcess'
import useMainStore from 'store/useMainStore'

import CustomIconButton from 'components/CustomIconButton'
import DeleteDoubleCheck from 'components/DeleteDoubleCheck'
import SearchTableCustom from 'components/TableCustom/SearchTableCustom'

type ProcessListingSidebarProps = {
  handleDrawer: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
  openRegister: Dispatch<SetStateAction<boolean>>
  openInitiator: Dispatch<SetStateAction<boolean>>
  customCb: Dispatch<ITemplateProcessCreated>
}
// TODO: Usar um componente generico
export default function ProcessListingSidebar({
  handleDrawer,
  isOpen = true,
  openRegister,
  openInitiator,
  customCb
}: ProcessListingSidebarProps) {
  const isSuperAdmin = useIsSuperAdmin()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [templateProcessList, getAllTemplateProcesses, deleteTemplateProcess] =
    useMainStore((state) => [
      state.templateProcessList,
      state.getAllTemplateProcesses,
      state.deleteTemplateProcess
    ])

  const [processesTypesList, setProcessesTypesList] = useState<any[]>([])
  const [showDeletePrompt, setShowDeletePrompt] = useState<boolean>(false)
  const [itemToBeDeleted, setItemToBeDeleted] = useState<string>('')

  const handleDrawerClose = () => {
    handleDrawer(false)
  }

  const openTemplateProcessModelRegister = () => {
    openRegister(true)
    handleDrawerClose()
  }

  const handleUserAddProcess = (
    event: React.MouseEvent<HTMLElement>,
    doc: ITemplateProcessCreated
  ) => {
    event.stopPropagation()
    customCb(doc)
    openInitiator(true)
    handleDrawerClose()
  }

  const searchByTitle = (searchQuery: string) => {
    let processType = templateProcessList
    if (searchQuery) {
      processType =
        templateProcessList &&
        templateProcessList.filter((processType: any) => {
          const element = processType.title.toLowerCase()
          const query = searchQuery.toLowerCase()
          const result = element.includes(query)
          return result
        })
    }

    setProcessesTypesList(processType as any)
  }

  const setCurrentTemplate = (
    event: React.MouseEvent<HTMLElement>,
    id: string
  ) => {
    event.stopPropagation()
    setItemToBeDeleted(id)
    setShowDeletePrompt(true)
  }

  function deleteItem(decision: string) {
    if (decision === 'yes') {
      deleteTemplateProcess(itemToBeDeleted)
    }

    setShowDeletePrompt(false)
  }

  useEffect(() => {
    if (templateProcessList) {
      setProcessesTypesList(templateProcessList as any)
      return
    }
    getAllTemplateProcesses()
  }, [templateProcessList, getAllTemplateProcesses])

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
  }

  return (
    <Drawer anchor="right" open={isOpen} onClose={handleDrawerClose}>
      <Box
        sx={{
          backgroundColor: theme.palette.background.customBackground,
          minWidth: '30vw',
          maxWidth: '400px'
        }}
      >
        <Box className="flex items-center p-4">
          <Typography
            variant="body1"
            fontWeight="bold"
            color="white"
            alignSelf="center"
            fontSize={25}
          >
            Lista de processos
          </Typography>

          {isMobile && (
            <Box className="flex ml-auto">
              <IconButton
                onClick={handleDrawerClose}
                sx={{
                  position: 'relative',
                  color: 'white'
                }}
              >
                <CancelOutlinedIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>

      <SearchTableCustom onSearch={searchByTitle} className="pr-8" />

      <List
        sx={{
          maxHeight: 'calc(100vh - 220px)',
          overflowY: 'scroll',
          overflow: 'auto'
        }}
      >
        {processesTypesList.length ? (
          processesTypesList?.map((doc, idx) => (
            <ListItem
              key={idx}
              sx={{
                color: theme.palette.text.contentDarkLight,
                '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' },
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 1
              }}
              onClick={(e) => handleUserAddProcess(e, doc)}
            >
              <Box className="flex pr-2">
                <Image
                  src="/excel.png"
                  alt="logo excel"
                  width={20}
                  height={20}
                  style={{
                    borderRadius: '8px',
                    marginRight: '8px'
                  }}
                />
                <Typography
                  sx={{
                    color: theme.palette.text.contentDarkLight,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '160px'
                  }}
                >
                  {doc.title}
                </Typography>
              </Box>

              <Box className="flex gap-1">
                <CustomIconButton
                  id={doc.id}
                  sx={{
                    padding: 0,
                    '&:hover': {
                      backgroundColor: 'transparent'
                    }
                  }}
                  link={doc.bucketUrl}
                  onClick={handleClick}
                >
                  <DownloadIcon sx={{ color: '#4169e1' }} />
                </CustomIconButton>

                {isSuperAdmin && (
                  <CustomIconButton
                    id={doc.id}
                    sx={{
                      padding: 0,
                      '&:hover': {
                        backgroundColor: 'transparent'
                      }
                    }}
                    onClick={(e) => setCurrentTemplate(e, doc.id)}
                  >
                    <CancelOutlinedIcon sx={{ color: 'gray' }} />
                  </CustomIconButton>
                )}
              </Box>
            </ListItem>
          ))
        ) : (
          <ListItem
            sx={{
              color: theme.palette.text.contentDarkLight,
              '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' },
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 1
            }}
          >
            <Typography>Nenhum processo cadastrado.</Typography>
          </ListItem>
        )}
      </List>

      {isSuperAdmin && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={openTemplateProcessModelRegister}
          sx={{ position: 'absolute', bottom: 26, right: 26 }}
        >
          <AddIcon color="primary" />
        </Fab>
      )}

      <DeleteDoubleCheck
        title="Confirmar exclusão?"
        open={showDeletePrompt}
        closeDoubleCheck={() => setShowDeletePrompt(false)}
        deleteItem={deleteItem}
      />
    </Drawer>
  )
}
