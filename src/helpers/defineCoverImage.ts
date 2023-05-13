import { IMediaCreated } from 'interfaces/entities/media'

export function defineCoverImage(midias: IMediaCreated[]) {
  // TODO: Filtrar o tipo da imagem
  // Ver se o array é vazio
  return {
    source: '/logo-ativacao.png',
    alt: 'Texto alternativo'
  }
}
