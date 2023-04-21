// import dotenv from 'dotenv'
// import { prisma } from 'lib/prisma'
// import { Image } from 'models/Image'
// import type {
//   IImage,
//   IImageCreated,
//   IImageFilter
// } from 'interfaces/entities/image'

// dotenv.config()
// const ImageRepository = Image.of(prisma)

// async function create(params: IImage): Promise<IImageCreated> {
//   const Images = await ImageRepository.create(params)
//   return Images
// }

// async function get(filter: IImageFilter): Promise<IImageCreated[]> {
//   const Images = await ImageRepository.getAll(filter)
//   return Images
// }

// async function deleteOne(id: string): Promise<void> {
//   await ImageRepository.delete(id)
// }

// export { create, get, deleteOne }
