import * as MediaUseCases from './media'

async function create(type: string, params: any): Promise<any | null> {
  if (!type) throw new Error('Type is required')

  let fileType: string
  if(['image', 'video'].includes(type)) {
    fileType = type
  } else  {
    fileType = 'document'
  }

  const result = await MediaUseCases.create({...params, type: fileType})
  return result
}

async function getAll(type: string, filter: any): Promise<any[] | null> {
  if (!type) throw new Error('Type is required')

  return MediaUseCases.getAll(filter)
}

async function deleteOne(type: string, id: string): Promise<void> {
  if (!type) throw new Error('FileType is required')

  return MediaUseCases.deleteOne(id)
}

export default { create, getAll, deleteOne }
