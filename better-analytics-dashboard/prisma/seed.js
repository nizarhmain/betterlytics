import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const SALT_ROUNDS = 10;

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (!existingAdmin) {
    console.log(`Creating admin user with email: ${ADMIN_EMAIL}...`);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

    await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: 'Admin',
        passwordHash: hashedPassword,
        role: 'admin',
      },
    });
    console.log('Admin user created successfully');
  }
}

main();
