import Image from 'next/image'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react'

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
  Fab,
  Tooltip
} from '@mui/material'
import useIsSuperAdmin from 'hooks/useIsSuperAdmin'
import { ITemplateOrderCreated } from 'interfaces/entities/templateOrder'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'

import CustomIconButton from 'components/CustomIconButton'
import DeleteDoubleCheck from 'components/DeleteDoubleCheck'
import LoadingScreen from 'components/LoadingScreen'
import OrderRegisterModal from 'components/OrderRegisterModal'
import RegisterOrderTemplateView from 'components/RegisterOrderTemplateModal'
import SearchTableCustom from 'components/TableCustom/SearchTableCustom'

interface SideBarTemplate extends ITemplateOrderCreated {
  id: string
  title: string
  bucketUrl: string
}

type SidebarListProps = {
  handleDrawer: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
  onCreateItem?: () => void
}

export default function SidebarList({
  handleDrawer,
  isOpen = true,
  onCreateItem
}: SidebarListProps) {
  const isSuperAdmin = useIsSuperAdmin()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [isLoading, setLoading, setToaster] = useGlobalStore((state) => [
    state.loading,
    state.setLoading,
    state.setToaster
  ])

  const [isModalOpen, setModalVisibility] = useState(false)
  const [templateListCopy, setTemplateListCopy] = useState<SideBarTemplate[]>(
    []
  )
  const [isRegisterTemplateModalOpen, setRegisterTemplateModalVisibility] =
    useState(false)
  const [templateList, setTemplateList] = useState<SideBarTemplate[]>([])
  const [showDeletePrompt, setShowDeletePrompt] = useState<boolean>(false)
  const [currentTemplate, setCurrentTemplate] =
    useState<SideBarTemplate | null>(null)

  const handleDrawerClose = () => {
    handleDrawer(false)
  }

  const openTemplateModalRegister = () => {
    handleDrawerClose()
    setRegisterTemplateModalVisibility(true)
  }

  const openCreateModel = (
    event: React.MouseEvent<HTMLElement>,
    template: SideBarTemplate
  ) => {
    event.stopPropagation()
    setCurrentTemplate(template)
    setModalVisibility(true)
    handleDrawerClose()
  }

  const searchByTitle = (searchQuery: string) => {
    let filteredTemplates = [...templateList]
    if (searchQuery) {
      filteredTemplates =
        templateList &&
        templateList.filter((filteredTemplates: any) => {
          const element = filteredTemplates.title.toLowerCase()
          const query = searchQuery.toLowerCase()
          const result = element.includes(query)
          return result
        })
    } else {
      filteredTemplates = templateListCopy
    }

    setTemplateList(filteredTemplates)
  }

  const deleteTemplate = (
    event: React.MouseEvent<HTMLElement>,
    template: SideBarTemplate
  ) => {
    event.stopPropagation()
    setCurrentTemplate(template)
    setShowDeletePrompt(true)
  }

  const deleteItem = async (decision: string) => {
    setShowDeletePrompt(false)

    if (decision === 'yes') {
      const filteredList = templateList
      setLoading(true)

      try {
        if (!currentTemplate) throw new Error('Template não encontrado')

        await httpServices.templateOrder.delete(currentTemplate.id)
        const indexDeleted = filteredList.findIndex(
          (item) => item.id == currentTemplate.id
        )

        filteredList.splice(indexDeleted, 1)

        setToaster({
          isOpen: true,
          message: 'Item deletado com sucesso',
          type: 'success'
        })
      } catch (error) {
        console.error(error)

        setToaster({
          isOpen: true,
          message:
            'Erro ao deletar item. Tente novamente ou entre em contato com o suporte',
          type: 'error'
        })
      } finally {
        setTemplateList(filteredList)
        setLoading(false)
        setCurrentTemplate(null)
      }
    }
  }

  const fetchData = useCallback(async () => {
    try {
      const templateList = await httpServices.templateOrder.getAll()
      if (templateList.data) {
        setTemplateList(templateList.data)
        setTemplateListCopy(templateList.data)
      }
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    isOpen && fetchData()
  }, [isOpen, fetchData])

  return (
    <>
      <Drawer anchor="right" open={isOpen} onClose={handleDrawerClose}>
        {isLoading && <LoadingScreen />}
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
              Modelos de pedido
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
            overflow: 'auto',
            marginTop: 2
          }}
        >
          {templateList.length ? (
            templateList?.map((template, idx) => (
              <ListItem
                key={idx}
                sx={{
                  color: theme.palette.text.contentDarkLight,
                  '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' },
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: 1
                }}
                onClick={(e) => openCreateModel(e, template)}
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
                  <Tooltip title={template.title}>
                    <Typography
                      sx={{
                        color: theme.palette.text.contentDarkLight,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '260px'
                      }}
                    >
                      {template.title}
                    </Typography>
                  </Tooltip>
                </Box>

                <Box className="flex gap-2 pr-2">
                  <CustomIconButton
                    id={template.id}
                    sx={{
                      padding: 0,
                      '&:hover': {
                        backgroundColor: 'transparent'
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    link={template.bucketUrl}
                    download
                  >
                    <DownloadIcon sx={{ color: '#4169e1' }} />
                  </CustomIconButton>

                  {isSuperAdmin && (
                    <CustomIconButton
                      id={template.id}
                      sx={{
                        padding: 0,
                        '&:hover': {
                          backgroundColor: 'transparent'
                        }
                      }}
                      onClick={(e) => deleteTemplate(e, template)}
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
              <Typography>Nenhum item cadastrado.</Typography>
            </ListItem>
          )}
        </List>

        {isSuperAdmin && (
          <Fab
            color="primary"
            aria-label="add"
            onClick={openTemplateModalRegister}
            sx={{ position: 'absolute', bottom: 26, right: 26 }}
          >
            <AddIcon color="primary" />
          </Fab>
        )}
      </Drawer>

      <DeleteDoubleCheck
        title="Confirmar exclusão?"
        open={showDeletePrompt}
        closeDoubleCheck={() => setShowDeletePrompt(false)}
        deleteItem={deleteItem}
      />

      {currentTemplate && (
        <OrderRegisterModal
          templateOrder={currentTemplate}
          isOpen={isModalOpen}
          closeModal={setModalVisibility}
          onCreateItem={onCreateItem}
          buttonText="Criar pedido"
        />
      )}

      <RegisterOrderTemplateView
        closeModal={() => setRegisterTemplateModalVisibility(false)}
        isOpen={isRegisterTemplateModalOpen}
        onCreateItem={() => fetchData()}
      />
    </>
  )
}
