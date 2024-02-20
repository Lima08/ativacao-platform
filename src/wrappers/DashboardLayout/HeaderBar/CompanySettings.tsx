import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Box, Button, FormControl, TextField } from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { ICompanyCreated } from 'interfaces/entities/company'
import { useAuthStore } from 'store/useAuthStore'
import useMainStore from 'store/useMainStore'

import ModalCustom from 'components/ModalCustom'

function CompanySettings({
  handleCloseModal
}: {
  handleCloseModal: () => void
}) {
  const router = useRouter()

  const [currentCompany, setCurrentCompany] = useState<ICompanyCreated | null>(
    null
  )

  const [companiesList, getAllCompanies, updateUser] = useMainStore((state) => [
    state.companiesList,
    state.getAllCompanies,
    state.updateUser
  ])
  const [company, user] = useAuthStore((state) => [
    // @ts-ignore
    state.company,
    // @ts-ignore
    state.user
  ])

  const handleChangeCompany = (event: any) => {
    if (!companiesList) return
    const company = companiesList.find(
      (company) => company.id === event.target.value
    )

    if (!company) return
    setCurrentCompany(company)
  }

  const handleSaveConfiguration = () => {
    updateUser(user.id, { companyId: currentCompany?.id })
    router.push('/login')
  }

  useEffect(() => {
    if (!(user && user.role >= ROLES.SYSTEM_ADMIN)) return
    getAllCompanies()
  }, [getAllCompanies, user])

  useEffect(() => {
    if (!company) return
    setCurrentCompany(company)
  }, [company])

  return (
    <ModalCustom title="Configurações" closeModal={handleCloseModal}>
      <>
        {user && user.role >= ROLES.SYSTEM_ADMIN && companiesList && (
          <Box sx={{ minWidth: 120 }}>
            <TextField
              variant="standard"
              label="Nome da empresa atual"
              value={currentCompany?.name}
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              variant="standard"
              label="Slug para cadastro de usuários"
              value={currentCompany?.slug}
              fullWidth
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth>
              <label htmlFor="companySelect">Trocar empresa</label>
              <select
                id="companySelect"
                value={0}
                onChange={handleChangeCompany}
              >
                <option value="">selecione...</option>
                {companiesList.length > 0 &&
                  companiesList.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
              </select>
            </FormControl>
          </Box>
        )}

        <Button
          variant="contained"
          onClick={handleSaveConfiguration}
          sx={{ width: '100%', mt: 2 }}
          disabled={currentCompany?.id === company.id}
        >
          Ir para empresa selecionada
        </Button>
      </>
    </ModalCustom>
  )
}

export default CompanySettings
