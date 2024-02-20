'use client'
import { useCallback, useEffect, useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp'
import SmsIcon from '@mui/icons-material/Sms'
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff'
import {
  Box,
  Paper,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  TableHead,
  Tooltip
} from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { IDocumentCreated } from 'interfaces/entities/document'
import { IOrderCreated } from 'interfaces/entities/Order'
import { eOrderStatus } from 'interfaces/entities/Order/EOrderStatus'
import { ITemplateOrderCreated } from 'interfaces/entities/templateOrder'
import httpServices from 'services/http'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'
import useGlobalStore from 'store/useGlobalStore'

import DeleteDoubleCheck from 'components/DeleteDoubleCheck'
import HandleOrderModal from 'components/HandleOrderModal'
import LoadingScreen from 'components/LoadingScreen'
import ModalCustom from 'components/ModalCustom'
import PageContainer from 'components/PageContainer'
import SidebarList from 'components/SidebarList'
import PaginationTableCustom from 'components/TableCustom/PaginationTableCustom'
import SearchTableCustom from 'components/TableCustom/SearchTableCustom'
import TableHeadCustom from 'components/TableCustom/TableHeadCustom'

import { formatDate } from '../../../../utils'

enum eColorStatus {
  info = 'info',
  success = 'success',
  error = 'error',
  warning = 'warning'
}

type IOrdersStatusType = {
  color: eColorStatus
  label: string
}

export interface IOrderAdapted extends IOrderCreated {
  templateTitle: string
  documents: IDocumentCreated[]
  badge: IOrdersStatusType
}

export default function OrderListView() {
  const TABLE_HEAD = [
    { id: 'status', label: 'Status', align: 'center' },
    { id: 'type', label: 'Tipo', align: 'center' },
    { id: 'title', label: 'Título', align: 'center' },
    { id: 'updatedAt', label: 'Atualizado em', align: 'center' },
    { id: 'message', label: 'Mensagem', align: 'center' },
    { id: 'actions', label: 'Ações', align: 'center' }
  ]

  const TABLE_HEAD_MOBILE = [
    { id: 'status', label: 'Status', align: 'center' },
    { id: 'title', label: 'Título', align: 'center' },
    { id: 'actions', label: 'Ações', align: 'center' }
  ]

  const { user } = useAuthStore((state) => state) as IAuthStore

  const [loading, setLoading, page, rowsPerPage, setToaster] = useGlobalStore(
    (state) => [
      state.loading,
      state.setLoading,
      state.page,
      state.rowsPerPage,
      state.setToaster
    ]
  )

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [isSystemAdmin, setIsSystemAdmin] = useState(false)
  const [filteredOrders, setFilteredOrders] = useState<IOrderAdapted[]>([])
  const [orderListAdapted, setOrderListAdapted] = useState<IOrderAdapted[]>([])
  const [currentOrder, setCurrentOrder] = useState<IOrderAdapted | null>(null)
  const [openMessage, setOpenMessage] = useState({
    isOpen: false,
    message: null
  })
  const [isOrderHandleModalOpen, setOrderHandleModalVisibility] =
    useState(false)
  const [openOptions, setOpenOptions] = useState<any>(null)
  const [openOrderListing, setOpenOrderListing] = useState(false)
  const [showDeletePrompt, setShowDeletePrompt] = useState(false)
  const [orderList, setOrderList] = useState<IOrderCreated[]>([])
  const [templateOrderList, setTemplateOrderList] = useState<
    ITemplateOrderCreated[]
  >([])

  const orderStatusAdapter = (status: eOrderStatus): IOrdersStatusType => {
    const statusMappers: Record<
      eOrderStatus,
      { color: eColorStatus; label: string }
    > = {
      received: { color: eColorStatus.info, label: 'Recebido' },
      processing: { color: eColorStatus.warning, label: 'Em separação' },
      rejected: { color: eColorStatus.error, label: 'Rejeitado' },
      invoiced: { color: eColorStatus.success, label: 'Faturado' }
    }

    return statusMappers[status]
  }

  const openOrderListingSidebar = async () => {
    setOpenOrderListing(true)
  }

  const openOrderHandleModal = async () => {
    setOrderHandleModalVisibility(true)
    setOpenOptions(null)
  }

  const openMenu = (event: any, order: IOrderAdapted) => {
    setOpenOptions(event.currentTarget)
    setCurrentOrder(order)
  }

  const closeMenu = () => {
    setOpenOptions(null)
    setCurrentOrder(null)
  }

  const deleteItem = async () => {
    if (currentOrder) {
      try {
        setShowDeletePrompt(false)
        await httpServices.order.delete(currentOrder.id)
        setToaster({
          isOpen: true,
          message: 'Pedido deletado com sucesso',
          type: 'success'
        })
        loadOrderList()
      } catch (error) {
        console.error(error)
        setToaster({
          isOpen: true,
          message: 'Erro ao deletar pedido',
          type: 'error'
        })
      } finally {
        closeMenu()
        setLoading(false)
      }
    }
  }

  const adaptOrders = useCallback(() => {
    const orderAdaptedList = orderList
      ? orderList
          .map((order: IOrderCreated) => {
            const orderTemplate = templateOrderList.find(
              (template: ITemplateOrderCreated) =>
                template.id === order.templateOrderId
            )

            const orderAdapted: IOrderAdapted = {
              ...order,
              id: order.id,
              title: order.title,
              templateTitle: orderTemplate?.title || 'Template não encontrado',
              message: order.message,
              documents: order?.documents || [],
              badge: orderStatusAdapter(order.status),
              updatedAt: order.createdAt
            }

            return orderAdapted
          })
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : []

    setOrderListAdapted(orderAdaptedList)
    orderAdaptedList && setFilteredOrders(orderAdaptedList)
  }, [setOrderListAdapted, orderList, page, rowsPerPage, templateOrderList])

  const searchByTitle = (searchQuery: string) => {
    const filteredOrders = orderListAdapted.filter((analysis: any) => {
      const analysisTitle = analysis.title.toLowerCase()
      const query = searchQuery.toLowerCase()
      return analysisTitle.includes(query)
    })
    setFilteredOrders(filteredOrders)
  }

  const loadOrderList = useCallback(async () => {
    setLoading(true)
    try {
      const orders = await httpServices.order.getAll()
      orders?.data && setOrderList(orders.data)
    } catch (error: any) {
      setToaster({
        isOpen: true,
        message: error.message || 'Erro ao carregar pedidos',
        type: 'error'
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [setLoading, setToaster])

  const loadTemplateOrderList = useCallback(async () => {
    setLoading(true)
    try {
      const orderTemplates = await httpServices.templateOrder.getAll()
      orderTemplates?.data && setTemplateOrderList(orderTemplates.data)
    } catch (error: any) {
      console.error(error)
      setToaster({
        isOpen: true,
        message: error.message || 'Erro ao carregar modelos de pedidos',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [setLoading, setToaster])

  const handleCloseOrderModal = async () => {
    setOrderHandleModalVisibility(false)
    await loadOrderList()
    adaptOrders()
  }

  const loadViewState = useCallback(async () => {
    await Promise.all([loadOrderList(), loadTemplateOrderList()])
  }, [loadOrderList, loadTemplateOrderList])

  useEffect(() => {
    loadViewState()
  }, [loadViewState, setLoading])

  useEffect(() => {
    adaptOrders()
  }, [adaptOrders, orderList])

  useEffect(() => {
    if (!user) return
    setIsSystemAdmin(user.role >= ROLES.SYSTEM_ADMIN)
  }, [user])

  if (Number(user?.role) < ROLES.COMPANY_ADMIN) {
    return (
      <Box sx={{ m: 4 }} suppressHydrationWarning={true}>
        <Typography>Você não tem permissão para ver esta página.</Typography>
      </Box>
    )
  }

  return (
    <PageContainer
      pageTitle="Pedidos"
      pageSection="orders"
      customCallback={openOrderListingSidebar}
    >
      {loading && <LoadingScreen />}

      <Paper>
        <SearchTableCustom onSearch={searchByTitle} />

        <TableContainer sx={{ maxHeight: '56vh' }}>
          <Table stickyHeader>
            {!!filteredOrders?.length && (
              <TableHead>
                {!isMobile && <TableHeadCustom headLabel={TABLE_HEAD} />}
                {isMobile && <TableHeadCustom headLabel={TABLE_HEAD_MOBILE} />}
              </TableHead>
            )}

            <TableBody>
              {filteredOrders &&
                filteredOrders.map((row: any) => {
                  const {
                    id,
                    title,
                    templateTitle,
                    updatedAt,
                    message,
                    badge
                  } = row

                  return (
                    <TableRow
                      key={id}
                      sx={{ '$:hover': { cursor: 'pointer' } }}
                    >
                      <TableCell
                        size="small"
                        align="center"
                        component="th"
                        scope="row"
                        sx={{
                          maxWidth: '120px'
                        }}
                      >
                        <Chip label={badge.label} color={badge.color} />
                      </TableCell>
                      {!isMobile && (
                        <>
                          <TableCell
                            size="small"
                            align="center"
                            component="th"
                            sx={{
                              maxWidth: `${isMobile ? '100px' : '200px'}`
                            }}
                          >
                            <Tooltip title={templateTitle}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  width: '100%',
                                  textAlign: 'center'
                                }}
                              >
                                {templateTitle}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell
                            align="center"
                            size="small"
                            component="th"
                            sx={{
                              maxWidth: `${isMobile ? '100px' : '200px'}`
                            }}
                          >
                            <Tooltip title={title}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  width: '100%',
                                  textAlign: 'center'
                                }}
                              >
                                {title}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell size="small" align="center" component="th">
                            {formatDate(updatedAt)}
                          </TableCell>
                        </>
                      )}
                      {isMobile && (
                        <TableCell
                          size="small"
                          align="center"
                          component="th"
                          sx={{
                            maxWidth: `${isMobile ? '100px' : '200px'}`
                          }}
                        >
                          <Tooltip title={title}>
                            <Typography
                              noWrap
                              sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width: '100%',
                                textAlign: 'center'
                              }}
                            >
                              {title}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                      )}
                      {!isMobile && (
                        <TableCell size="small" align="center" component="th">
                          {!!message?.length && (
                            <IconButton
                              aria-label="message"
                              size="large"
                              onClick={() =>
                                setOpenMessage({ isOpen: true, message })
                              }
                            >
                              <SmsIcon />
                            </IconButton>
                          )}

                          {!message && (
                            <IconButton
                              aria-label="message"
                              size="large"
                              disabled
                            >
                              <SpeakerNotesOffIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      )}

                      <TableCell size="small" align="center" component="th">
                        <IconButton
                          color="inherit"
                          onClick={(event) => openMenu(event, row)}
                        >
                          <MoreVertSharpIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              {filteredOrders && !filteredOrders.length && (
                <TableRow sx={{ px: 2 }}>
                  <TableCell size="small" align="center" component="th">
                    <Typography variant="subtitle2">
                      Nenhum pedido encontrado
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <PaginationTableCustom tableItems={orderList} />
      </Paper>

      <Popover
        open={Boolean(openOptions)}
        anchorEl={openOptions}
        onClose={() => closeMenu()}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 150,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75
            }
          }
        }}
      >
        {isSystemAdmin && (
          <MenuItem onClick={() => openOrderHandleModal()}>
            <IconButton aria-label="edit">
              <EditIcon />
            </IconButton>
            Analisar
          </MenuItem>
        )}
        <MenuItem
          sx={{ color: 'error.main' }}
          onClick={() => setShowDeletePrompt(true)}
        >
          <IconButton aria-label="delete" sx={{ color: 'error.main' }}>
            <DeleteIcon />
          </IconButton>
          Deletar
        </MenuItem>
      </Popover>

      {openMessage.isOpen && (
        <ModalCustom
          title="Mensagem:"
          closeModal={() => setOpenMessage({ isOpen: false, message: null })}
          width={700}
          height={500}
        >
          <TextField
            id="message"
            value={openMessage?.message || ''}
            multiline
            rows={16}
            fullWidth
            disabled
            variant="outlined"
            sx={{ height: '100%' }}
          />
        </ModalCustom>
      )}

      <SidebarList
        handleDrawer={setOpenOrderListing}
        isOpen={openOrderListing}
        onCreateItem={loadViewState}
      />

      {currentOrder && (
        <HandleOrderModal
          order={currentOrder}
          isOpen={isOrderHandleModalOpen}
          closeModal={handleCloseOrderModal}
        />
      )}

      <DeleteDoubleCheck
        title="Confirmar exclusão?"
        open={showDeletePrompt}
        closeDoubleCheck={() => setShowDeletePrompt(false)}
        deleteItem={deleteItem}
      />
    </PageContainer>
  )
}
