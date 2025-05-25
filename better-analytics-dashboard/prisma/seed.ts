import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

const DEFAULT_DASHBOARD_TRACKING_ID = process.env.SITE_ID || 'default-site'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'
const SALT_ROUNDS = 10

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL }
  })
  
  let adminUser
  
  if (!existingAdmin) {
    console.log(`Creating admin user with email: ${ADMIN_EMAIL}...`)
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS)
    
    adminUser = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: 'Admin',
        passwordHash: hashedPassword,
        role: 'admin',
      }
    })
    console.log('Admin user created successfully')
  } else {
    console.log('Admin user already exists, skipping creation')
    adminUser = existingAdmin
  }

  // const dashboard = await prisma.dashboard.upsert({
  //   where: { siteId: DEFAULT_DASHBOARD_TRACKING_ID },
  //   update: {
  //     name: 'Default Admin Dashboard',
  //     userId: adminUser.id
  //   },
  //   create: {
  //     siteId: DEFAULT_DASHBOARD_TRACKING_ID,
  //     name: 'Default Admin Dashboard',
  //     userId: adminUser.id
  //   },
  // })

  // const funnelName = 'Basic funnel'
  
  // let existingFunnel = await prisma.funnel.findFirst({
  //   where: {
  //     name: funnelName,
  //     dashboardId: dashboard.id
  //   }
  // })

  // if (!existingFunnel) {
  //   await prisma.funnel.create({
  //     data: {
  //       name: funnelName,
  //       pages: ['/dashboard', '/dashboard/pages', '/dashboard/geography'],
  //       dashboard: {
  //         connect: { id: dashboard.id }, 
  //       },
  //     }
  //   })
  // }
}

main()