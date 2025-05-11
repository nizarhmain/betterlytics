
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const siteData: Prisma.SiteCreateInput = {
  siteId: 'default-site',
}

export async function main() {
  await prisma.site.create({ data: siteData })
}

main()
