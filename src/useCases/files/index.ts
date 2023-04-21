import * as ImagesUseCases from './images'
import { FileType } from 'constants/enums/FiletypeEnum'

const Instances: Record<string, any> = {
  [FileType.IMAGE]: ImagesUseCases
}

const typeValues: { [key: string]: FileType } = {
  image: FileType.IMAGE,
  video: FileType.VIDEO,
  default: FileType.DOCUMENT
}

function defineFileType(type: string): FileType {
  if (type in FileType) {
    return typeValues[type]
  }

  const separatorIndex = type.indexOf('/')
  const fileType = type.substring(0, separatorIndex)
  if (fileType in typeValues) {
    return typeValues[fileType]
  }

  return typeValues.default
}
// TODO: Tipar corretamente (criar fileParams ou adicionar adapter)
async function create(mimetype: string, params: any): Promise<any | null> {
  if (!mimetype) throw new Error('Type is required')
  const typeFile = defineFileType(mimetype)
  return Instances[typeFile].create(params)
}

// TODO: Tipar corretamente
async function getAll(mimetype: string, filter: any): Promise<any[] | null> {
  if (!mimetype) throw new Error('Type is required')

  const typeFile = defineFileType(mimetype)
  return Instances[typeFile].getAll(filter)
}

async function deleteOne(fileType: string, id: string): Promise<void> {
  if (!fileType) throw new Error('FileType is required')

  const typeFile = defineFileType(fileType)
  return Instances[typeFile].deleteOne(id)
}

export default { create, getAll, deleteOne }
