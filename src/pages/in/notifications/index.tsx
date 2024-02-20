'use client'
import { useEffect, useState } from 'react'

import {
  Box,
  List,
  ListItem,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { INotificationCreated } from 'interfaces/entities/notification'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import NotificationCardItem from 'components/NotificationCardItem'
import NotificationSkeleton from 'components/NotificationCardItem/NotificationSkeleton'
import NotificationCreateOrEditCard from 'components/NotificationCreateOrEditCard'
import PageContainer from 'components/PageContainer'

import { FIVE_SECONDS } from './../../../constants'

export default function NotificationList() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [loading, error, setToaster] = useGlobalStore((state) => [
    state.loading,
    state.error,
    state.setToaster
  ])
  const [notificationsList, getAllNotifications, setCurrentNotification] =
    useMainStore((state) => [
      state.notificationsList,
      state.getAllNotifications,
      state.setCurrentNotification
    ])

  function setNotificationToUpdate(notification: INotificationCreated) {
    setCurrentNotification(notification)
    setIsModalOpen(true)
  }

  useEffect(() => {
    if (notificationsList) return
    getAllNotifications()
  }, [notificationsList, getAllNotifications])

  useEffect(() => {
    if (!error) return
    console.error(error)

    setToaster({
      isOpen: true,
      message: 'Um erro inesperado ocorreu.',
      type: 'error',
      duration: FIVE_SECONDS
    })
  }, [error, setToaster])

  return (
    <PageContainer
      pageTitle="Notificações"
      pageSection="Notificações"
      customCallback={() => setIsModalOpen(true)}
    >
      <List
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 3
        }}
      >
        {notificationsList &&
          notificationsList.map((notification) => (
            <ListItem
              key={notification.id}
              sx={{
                width: '100%',
                maxWidth: `${isMobile ? '100%' : '30%'}`,
                minWidth: 200,
                p: 0,
                ':hover': {
                  cursor: 'pointer',
                  transform: 'scale(1.05)',
                  boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.35)',
                  transition: 'all 0.3s ease-in-out'
                },
                ':not(:hover)': {
                  transition: 'transform 0.3s ease-in-out'
                }
              }}
              onClick={() => setNotificationToUpdate(notification)}
            >
              <NotificationCardItem {...notification} canDelete />
            </ListItem>
          ))}

        {!loading && notificationsList && notificationsList.length === 0 && (
          <Box>
            <Typography variant="h5" color="text.secondary" height="100%">
              Você não possui notificações no momento.
            </Typography>
          </Box>
        )}

        {loading && !isModalOpen && (
          <ListItem
            sx={{
              width: '100%',
              maxWidth: `${isMobile ? '100%' : '30%'}`,
              minWidth: 200,
              p: 0
            }}
          >
            <NotificationSkeleton />
          </ListItem>
        )}

        <NotificationCreateOrEditCard
          handleModalVisibility={setIsModalOpen}
          isModalOpen={isModalOpen}
        />
      </List>

      {!loading && !notificationsList && (
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Typography variant="h5" color="text.secondary">
            Você não possui notificações no momento.
          </Typography>
        </Stack>
      )}
    </PageContainer>
  )
}
