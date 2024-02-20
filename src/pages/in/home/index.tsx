import Image from 'next/image'
import { useEffect, useState } from 'react'

import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import CampaignIcon from '@mui/icons-material/Campaign'
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import PeopleIcon from '@mui/icons-material/People'
import {
  useMediaQuery,
  useTheme,
  Box,
  IconButton,
  Skeleton
} from '@mui/material'
import useIsAdmin from 'hooks/useIsAdmin'
import { ICompanyCreated } from 'interfaces/entities/company'
import { useAuthStore } from 'store/useAuthStore'
import { IAuthStore } from 'store/useAuthStore'
import useMainStore from 'store/useMainStore'

import NavigationCard from '../../../components/NavigationCard'

export default function HomePage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isAdmin = useIsAdmin()
  const [bannerUrl, setBannerUrl] = useState<string | null>(null)
  const { company } = useAuthStore((state) => state) as IAuthStore

  const [currentCompany, getCompanyById, setCurrentCompany] = useMainStore(
    (state) => [
      state.currentCompany,
      state.getCompanyById,
      state.setCurrentCompany
    ]
  )

  const handleImageError = () => {
    setBannerUrl('/hero-home.jpg')
  }

  useEffect(() => {
    if (!company || !company.id) return
    getCompanyById(String(company.id))
  }, [getCompanyById, company])

  useEffect(() => {
    if (!currentCompany && company) {
      setCurrentCompany(company as ICompanyCreated)
    }
  }, [currentCompany, company, setCurrentCompany])

  useEffect(() => {
    if (currentCompany && !currentCompany.imageUrl)
      setBannerUrl('/hero-home.jpg')
    if (currentCompany && currentCompany.imageUrl)
      setBannerUrl(currentCompany.imageUrl)
  }, [currentCompany])

  return (
    <section className="px-2 md:px-16">
      {!bannerUrl && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={isMobile ? 200 : 400}
          sx={{
            borderRadius: '8px',
            mt: 2,
            mb: 2
          }}
        />
      )}
      {bannerUrl && (
        <Box
          mt={isMobile ? 0 : 1}
          height={isMobile ? 200 : 400}
          maxWidth={1200}
          position="relative"
          margin="auto"
        >
          <Image
            fill
            priority
            alt="Banner principal"
            onError={handleImageError}
            src={bannerUrl}
            style={{ objectFit: 'cover', borderRadius: '8px' }}
          />
        </Box>
      )}
      <Box
        mt={4}
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent={isMobile ? 'center' : 'flex-start'}
        flexWrap="wrap"
        gap={isMobile ? 2 : 4}
      >
        <NavigationCard href="/in/campaigns" title="Campanhas">
          <IconButton>
            <CampaignIcon />
          </IconButton>
        </NavigationCard>
        <NavigationCard href="/in/trainings" title="Treinamentos">
          <IconButton>
            <AppRegistrationIcon />
          </IconButton>
        </NavigationCard>
        {isAdmin && (
          <NavigationCard href="/in/analyzes" title="Análises">
            <IconButton>
              <AutoGraphIcon />
            </IconButton>
          </NavigationCard>
        )}
        {isAdmin && (
          <NavigationCard href="/in/processes" title="Processos">
            <IconButton>
              <FilePresentIcon />
            </IconButton>
          </NavigationCard>
        )}
        <NavigationCard href="/in/notifications" title="Mural de avisos">
          <IconButton>
            <CircleNotificationsIcon />
          </IconButton>
        </NavigationCard>
        <NavigationCard href="/in/users" title="Usuários">
          <IconButton>
            <PeopleIcon />
          </IconButton>
        </NavigationCard>
      </Box>
    </section>
  )
}
