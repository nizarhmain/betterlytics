import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEFAULT_DASHBOARD_TRACKING_ID = 'default-site'

async function main() {
  const dashboard = await prisma.dashboard.upsert({
    where: { siteId: DEFAULT_DASHBOARD_TRACKING_ID },
    update: {},
    create: {
      siteId: DEFAULT_DASHBOARD_TRACKING_ID,
    },
  })

  const funnelName = 'Basic funnel'
  
  let existingFunnel = await prisma.funnel.findFirst({
    where: {
      name: funnelName,
      dashboardId: dashboard.id
    }
  })

  if (!existingFunnel) {
    await prisma.funnel.create({
      data: {
        name: funnelName,
        pages: ['/dashboard', '/dashboard/pages', '/dashboard/geography'],
        dashboard: {
          connect: { id: dashboard.id }, 
        },
      }
    })
  }
}

main()