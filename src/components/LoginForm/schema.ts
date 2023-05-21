import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Campo não pode ser vazio')
    .email('Formato de email inválido'),
  password: Yup.string()
    .required('Campo não pode ser vazio')
    .min(6, 'Senha muito curta')
})
