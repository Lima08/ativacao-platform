import { Dispatch, SetStateAction, useState } from 'react'

import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import {
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  useMediaQuery,
  Box,
  useTheme
} from '@mui/material'
import { INotificationCreated } from 'interfaces/entities/notification'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'
import { useNotificationStore } from 'store/useNotificationStore'

import NotificationCardItem from 'components/NotificationCardItem'
import NotificationSkeleton from 'components/NotificationCardItem/NotificationSkeleton'
import NotificationCreateOrEditCard from 'components/NotificationCreateOrEditCard'
type NotificationSidebarProps = {
  handleDrawer: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
}

export default function NotificationSidebar({
  handleDrawer,
  isOpen = true
}: NotificationSidebarProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading] = useGlobalStore((state) => [state.loading])
  const [notificationsViewed, setNotificationsViewed] = useNotificationStore(
    (state: any) => [state.notificationsViewed, state.setNotificationsViewed]
  )

  const [notificationsList, setCurrentNotification] = useMainStore((state) => [
    state.notificationsList,
    state.setCurrentNotification
  ])

  const handleSetNotificationsViewed = (
    currentNotification: INotificationCreated
  ) => {
    setCurrentNotification(currentNotification)
    setIsModalOpen(true)
    if (!notificationsViewed) return
    if (notificationsViewed.includes(currentNotification.id)) return
    setNotificationsViewed(currentNotification.id)
  }

  const handleDrawerClose = () => {
    handleDrawer(false)
  }

  return (
    <>
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
              Notificações
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

        <List>
          {loading && <NotificationSkeleton />}
          {notificationsList &&
            notificationsList.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  ':hover': {
                    backgroundColor: '#e0e0e0',
                    cursor: 'pointer',
                    mouse: 'pointer',
                    transform: 'scale(1.01)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
                onClick={() => handleSetNotificationsViewed(notification)}
              >
                <NotificationCardItem {...notification} />
              </ListItem>
            ))}
        </List>
      </Drawer>
      <NotificationCreateOrEditCard
        handleModalVisibility={setIsModalOpen}
        isModalOpen={isModalOpen}
        descriptionLabel="Descrição"
        onlyView
      />
    </>
  )
}
