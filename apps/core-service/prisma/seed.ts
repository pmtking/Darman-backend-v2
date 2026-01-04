import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';
import path from 'node:path';
import 'dotenv/config';

// ایجاد اتصال مستقیم از طریق درایور PG
// const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const pool = new pg.Pool({
  connectionString:process.env.DATABASE_URL
})
const adapter = new PrismaPg(pool);
// تزریق آداپتور به کلاینت
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 در حال اتصال به دیتابیس با Driver Adapter...');
  const hashedPassword = await bcrypt.hash('admin123456', 12);

  const admin = await prisma.personnel.upsert({
    where: { nationalId: '0000000000' },
    update: {},
    create: {
      name: 'مدیر کل سیستم',
      nationalId: '0000000000',
      phone: '09000000000',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log(`✅ ادمین با موفقیت ایجاد شد: ${admin.name}`);
}

main()
  .catch((e) => {
    console.error('❌ خطا در Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });