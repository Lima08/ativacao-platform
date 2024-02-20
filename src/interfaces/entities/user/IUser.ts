export interface IUser {
  name: string
  email: string
  password: string
  companyId: string // Em criação de usuário pode ser passado o slug como id
  imageUrl?: string
}
