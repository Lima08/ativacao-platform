import { useState } from 'react'

import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { Box, TextField, Button, IconButton } from '@mui/material'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'

import MediaShow from 'components/MediaShow'
import ModalCustom from 'components/ModalCustom'
import Uploader from 'components/Uploader'

function CompanySettings({
  handleCloseModal
}: {
  handleCloseModal: () => void
}) {
  const [setToaster, setLoading] = useGlobalStore((state) => [
    state.setToaster,
    state.setLoading
  ])

  const [companyName, setCompanyName] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)

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
    // Lógica para salvar a configuração (nome da empresa e foto)
    console.log('@@@@@@@SALVANDO CONFIG')
    handleCloseModal()
  }
  return (
    <ModalCustom title="Configurações" handleCloseModal={handleCloseModal}>
      <TextField label="Nome da Empresa" />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {!imageUrl && <Uploader uploadFile={uploadFile} />}
        {imageUrl && (
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
    </ModalCustom>
  )
}

export default CompanySettings
