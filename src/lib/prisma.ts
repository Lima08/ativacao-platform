import { PrismaClient } from '../../prisma/generated/prisma-client-js'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty'
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
