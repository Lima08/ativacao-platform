import { PrismaClient } from '../../prisma/generated/prisma-client-js'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: []
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
