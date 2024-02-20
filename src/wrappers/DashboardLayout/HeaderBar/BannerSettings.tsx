import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { Box, TextField, Button, IconButton } from '@mui/material'
import { useUpload } from 'hooks/useUpload'
import { useAuthStore } from 'store/useAuthStore'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import MediaShow from 'components/MediaShow'
import ModalCustom from 'components/ModalCustom'
import SuccessAction from 'components/SuccessAction'
import Uploader from 'components/Uploader'

function BannerSettings({
  handleCloseModal
}: {
  handleCloseModal: () => void
}) {
  const [loading, setToaster, setLoading] = useGlobalStore((state) => [
    state.loading,
    state.setToaster,
    state.setLoading
  ])
  const { uploadFiles } = useUpload()
  const router = useRouter()

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const [updateCompany] = useMainStore((state) => [state.updateCompany])
  const [company, setCompany] = useAuthStore((state) => [
    // @ts-ignore
    state.company,
    // @ts-ignore
    state.setCompany
  ])

  const saveImage = async (e: any) => {
    e.preventDefault()
    const files = e.target?.files

    try {
      setLoading(true)

      const mediaFiles = await uploadFiles(files)
      mediaFiles && setImageUrl(mediaFiles[0].url)
    } catch (error) {
      setToaster({
        isOpen: true,
        message: 'Error ao carregar imagem',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConfiguration = () => {
    updateCompany(String(company!.id), { imageUrl })
    setCompany({ ...company, imageUrl })
    setShowSuccess(true)
    router.push('/in/home')
  }

  const resetAndClose = () => {
    setImageUrl(company.imageUrl)
    setShowSuccess(false)
    handleCloseModal()
  }

  useEffect(() => {
    setImageUrl(company.imageUrl)
  }, [company.imageUrl])

  return (
    <ModalCustom title="Banner" closeModal={resetAndClose} width={600}>
      {!showSuccess && (
        <>
          <label htmlFor="companyImage">
            Trocar banner
            <TextField
              id="companyImage"
              value={imageUrl || ''}
              onChange={(e) => setImageUrl(e.target.value)}
              sx={{ width: '100%' }}
              placeholder="Adicione ua url de uma imagem"
            />
          </label>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1
            }}
          >
            {!imageUrl && (
              <Uploader
                uploadFile={saveImage}
                label="Adicionar banner"
                type="image"
                description="Adicione uma imagem para o banner"
                extensionsMessage="Recomendamos imagens com dimensões máximas de 980x560 e peso até 5mb"
              />
            )}
            {imageUrl && (
              <div className="relative ">
                <IconButton
                  style={{ zIndex: 1 }}
                  className="absolute right-0 top-0 m-1 hover:bg-red-500 hover:text-white"
                  onClick={() => setImageUrl(null)}
                >
                  <HighlightOffIcon />
                </IconButton>
                <MediaShow
                  url={imageUrl}
                  type="image"
                  width="100%"
                  height="auto"
                />
              </div>
            )}
          </Box>

          <Button
            variant="contained"
            onClick={handleSaveConfiguration}
            sx={{ width: '100%', mt: 2 }}
          >
            Salvar
          </Button>
        </>
      )}
      {!loading && showSuccess && <SuccessAction />}
    </ModalCustom>
  )
}

export default BannerSettings
