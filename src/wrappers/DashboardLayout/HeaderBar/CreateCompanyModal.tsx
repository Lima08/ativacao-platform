import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { Box, TextField, Button, IconButton } from '@mui/material'
import { useUpload } from 'hooks/useUpload'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'
import * as Yup from 'yup'

import ErrorAction from 'components/ErrorAction'
import MediaShow from 'components/MediaShow'
import ModalCustom from 'components/ModalCustom'
import SuccessAction from 'components/SuccessAction'
import Uploader from 'components/Uploader'

interface IFormValues {
  name: string
  slug: string
}
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(95, 'Nome muito longo')
    .min(3, 'Nome muito curto')
    .required(),
  slug: Yup.string()
    .max(95, 'Nome muito longo')
    .min(3, 'Nome muito curto')
    .required()
})

function CreateCompanyModal({
  handleCloseModal
}: {
  handleCloseModal: () => void
}) {
  const [loading, setToaster, setLoading] = useGlobalStore((state) => [
    state.loading,
    state.setToaster,
    state.setLoading
  ])
  const [createCompany, companyError, resetCompanyError] = useMainStore(
    (state) => [
      state.createCompany,
      state.companyError,
      state.resetCompanyError
    ]
  )

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  const { uploadFiles } = useUpload()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      slug: ''
    }
  })

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

  const handleSaveConfiguration = async (data: IFormValues) => {
    resetCompanyError()
    const { name, slug } = data

    const slugfy = slug.trim().replace(/\s+/g, '-').toLowerCase()

    const newData = {
      name,
      slug: slugfy,
      imageUrl: imageUrl || undefined
    }
    const company = await createCompany(newData)
    if (!company) return

    const message = `Empresa ${company?.slug} criada com sucesso!`
    setActionMessage(message)
    setShowSuccess(true)
  }

  const handleReset = () => {
    setImageUrl(null)
    setShowSuccess(false)
    resetCompanyError()
    setActionMessage(null)
    setShowError(false)
    reset()
  }

  const resetAndClose = () => {
    handleReset()
    handleCloseModal()
  }

  useEffect(() => {
    if (!companyError) return

    setActionMessage(companyError.message)
    setShowError(true)
    reset()
  }, [companyError, reset])

  return (
    <ModalCustom title="Nova empresa" closeModal={resetAndClose}>
      <form onSubmit={handleSubmit(handleSaveConfiguration)}>
        {!showSuccess && !showError && (
          <div>
            <TextField
              label="Nome da empresa"
              type="text"
              sx={{ width: '100%', mt: 2 }}
              {...register('name')}
            />
            {errors.name && (
              <span className=" text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}

            <TextField
              label="Slug da empresa"
              type="text"
              sx={{ width: '100%', mt: 2 }}
              {...register('slug')}
            />
            {errors.slug && (
              <span className=" text-red-500 text-sm">
                {errors.slug.message}
              </span>
            )}

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2
              }}
            >
              {!imageUrl && (
                <Uploader
                  uploadFile={saveImage}
                  label="Adicionar banner"
                  type="image"
                  description="Click para adicionar uma imagem"
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
              type="submit"
              sx={{ width: '100%', mt: 2 }}
            >
              Salvar
            </Button>
          </div>
        )}
      </form>

      {!loading && showSuccess && <SuccessAction message={actionMessage} />}
      {!loading && showError && <ErrorAction message={actionMessage} />}
    </ModalCustom>
  )
}

export default CreateCompanyModal
