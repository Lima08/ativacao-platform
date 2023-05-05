import { IMediaCreated } from 'interfaces/entities/media'

export function defineCoverImage(midias: IMediaCreated[]) {
  // TODO: Filtrar o tipo da imagem
  // Ver se o array é vazio
  return {
    source:
      'https://lojinha-da-aletha.dooca.store/admin/assets/logo-folded.1f809cab.svg',
    alt: 'Texto alternativo'
  }
}
