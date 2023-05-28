import { useState } from 'react'

import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { Box, TextField, Button, IconButton } from '@mui/material'
import httpServices from 'services/http'
import { useAuthStore } from 'store/useAuthStore'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import MediaShow from 'components/MediaShow'
import ModalCustom from 'components/ModalCustom'
import SuccessAction from 'components/SuccessAction'
import Uploader from 'components/Uploader'

function CompanySettings({
  handleCloseModal
}: {
  handleCloseModal: () => void
}) {
  const [loading, setToaster, setLoading] = useGlobalStore((state) => [
    state.loading,
    state.setToaster,
    state.setLoading
  ])
  const [updateCompany] = useMainStore((state) => [state.updateCompany])
  const [company, setCompany] = useAuthStore((state) => [
    // @ts-ignore
    state.company,
    // @ts-ignore
    state.setCompany
  ])

  const [companyName, setCompanyName] = useState(company.name)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const uploadFile = async (e: any) => {
    e.preventDefault()
    const files = e.target?.files

    if (!files.length) return

    if (files[0].type.split('/')[0] !== 'image') {
      setToaster({
        isOpen: true,
        message: 'Formato de arquivo inválido!',
        type: 'warning'
      })
      return
    }

    const formData = new FormData()
    formData.append('files', files[0])

    try {
      setLoading(true)
      const { data, error } = await httpServices.upload.save(formData)

      if (!!error || !data) {
        setToaster({
          isOpen: true,
          message: 'Error ao salvar imagem',
          type: 'error'
        })
        return
      }

      setImageUrl(data[0].url)
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
    updateCompany(String(company!.id), { name: companyName, imageUrl })
    setCompany({ ...company })
    // TODO: Salvar no auth
    setShowSuccess(true)
  }

  const handleReset = () => {
    setCompanyName(company.name)
    setImageUrl(company.imageUrl)
    setShowSuccess(false)
  }

  const resetAndClose = () => {
    handleReset()
    handleCloseModal()
  }
  return (
    <ModalCustom title="Configurações" closeModal={resetAndClose}>
      {!showSuccess && (
        <div>
          <TextField
            label="Nome da Empresa"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {!imageUrl && <Uploader uploadFile={uploadFile} />}
            {imageUrl && !showSuccess && (
              <div className="relative ">
                <IconButton
                  style={{ zIndex: 1 }}
                  className="absolute right-0 top-0 m-1 hover:bg-red-500 hover:text-white"
                  onClick={() => setImageUrl(null)}
                >
                  <HighlightOffIcon />
                </IconButton>
                <MediaShow url={imageUrl} type="image" />
              </div>
            )}
          </Box>
          <Button variant="outlined" onClick={handleSaveConfiguration}>
            Salvar
          </Button>
        </div>
      )}
      {!loading && showSuccess && <SuccessAction />}
    </ModalCustom>
  )
}

export default CompanySettings
