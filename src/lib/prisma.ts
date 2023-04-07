import { PrismaClient } from '../../prisma/generated/prisma-client-js'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
})

export default prisma
